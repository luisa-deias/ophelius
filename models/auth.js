var mongoose = require('mongoose');
///////////////////////auth///////////////////////777
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    bcrypt = require('bcrypt-nodejs');

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var conn = require('./conn.js');

var mail = require('./mail.js');

///////////////////authentication///////////////////////////
conn.app.use(morgan('dev'));
conn.app.use(cookieParser());
conn.app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
}));
conn.app.use(bodyParser.json());

conn.app.use(session({
    secret: 'secret-elseegwengo2ng23og23hn23qphn2p3èh2j4phyj23j',
    resave: true,
    saveUninitialized: true
}));
conn.app.use(passport.initialize());
conn.app.use(passport.session());
// We are going to protect /api routes with JWT
conn.app.use('/app/api', expressJwt({secret: 'secret'}));

/////////////////////////////////////////////////////////
var Schema = mongoose.Schema; 

var authSchema = new Schema({//schemes of users 
    hotel: { //administrator
        hcode: String, // code assigned to hotel
        username: String,
        password: String,
        name: String //hotel name
    },
    seller: { // seller member
        hcode: String,
        username: String,
        password: String,
    },
    guest: {
        hcode: String,
        room: String,    //room number    
        username: String,
        password: String,
        email: String,
        spot: String        
    }
});

var metrixSchema = new Schema({
    email: {
        email: String,
        date: { type: Date, default: Date.now },
        ipaddress: String
    }
});


// generating a hash
authSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid  for admin
authSchema.methods.validPasswordHotel = function(password) {
    return bcrypt.compareSync(password, this.hotel.password);
};
// for guest
authSchema.methods.validPasswordGuest = function(password) {
    return bcrypt.compareSync(password, this.guest.password);
};
// for seller member
authSchema.methods.validPasswordTeam = function(password) {
    return bcrypt.compareSync(password, this.seller.password);
};

// create the model for users and expose it to our app
var User = mongoose.model('User', authSchema, 'authSchema');
var Metrix = mongoose.model('Metrix', metrixSchema, 'metrixSchema');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// admin login
passport.use('master-login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({
            'hotel.username': username
        }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            if (!user.validPasswordHotel(password))
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            return done(null, user);
        });
    }));
// guest login
passport.use('guest-login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({
            'guest.username': username
        }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            if (!user.validPasswordGuest(password))
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            return done(null, user);
        });
    }));
// seller login
passport.use('seller-login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({
            'seller.username': username
        }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            if (!user.validPasswordTeam(password))
                return done(null, false, {
                    message: 'Wrong Username.'
                });
            return done(null, user);
        });
    }));
// guset signin
passport.use('guest-sign', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'email',
        passReqToCallback: true
    },
    function(req, username, email, done) {
        var room = username;
        username = req.user.hotel.hcode + username;
        User.findOne({
            'guest.username': username
        }, function(err, user) {
            if (err)
                return done(err);
            if (user)
                return done(null, false, {
                    message: 'Username already exists.'
                });
            else {
                var newUser = new User();
                var password = Math.random().toString(36).slice(-8);
                var message = "Username: " + username + "\r\n" + "Password: " + password;
                newUser.guest.hcode = req.user.hotel.hcode;
                newUser.guest.room = room;
                newUser.guest.username = username;
                newUser.guest.password = newUser.generateHash(password);
                newUser.guest.email = email;
                mail.sent(username, email, message);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, req.user);
                });
            }
        });
    }));
//seller signin
passport.use('seller-sign', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({
            'seller.username': username
        }, function(err, user) {
            if (err)
                return done(err);
            if (user)
                return done(null, false, {
                    message: 'Username already exists.'
                });
            else {
                var newUser = new User();
                newUser.seller.hcode = req.user.hotel.hcode;
                newUser.seller.username = username;
                newUser.seller.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, req.user);
                });
            }
        });
    }));
////////////////////////////////////////////////////////////
// return if is loged as admin
exports.isLoggedInAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.hotel.username != null) {
        return next();
    }
    res.redirect('/hotel/login');
}
// as guest
exports.isLoggedInGuest = function(req, res, next) {
    if (req.isAuthenticated() && req.user.guest.username != null) {
        return next();
    }
    res.redirect('/user/login');
}
//as seller member
exports.isLoggedInTeam = function(req, res, next) {
    if (req.isAuthenticated() && req.user.seller.username != null) {
        return next();
    }
    res.redirect('/seller/login');
}

exports.passport = passport;
exports.User = User;
exports.Metrix = Metrix;
exports.jwt = jwt;
