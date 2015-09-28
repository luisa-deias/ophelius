var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')

var conn = require('./models/conn.js');
var auth = require('./models/auth.js');
var api = require('./models/api.js');
var services = require('./models/services.js');
var mail = require('./models/mail.js');
/////////////////////////////////////////////////////////

var requestIp = require('request-ip');

mongoose.connect('mongodb://' + conn.connectionString);

conn.app.use(cors());

function redirectSec(req, res, next) {
    if (req.headers['x-forwarded-proto'] == 'http') {
        res.redirect('https://' + req.headers.host + req.path);
    } else {
        return next();
    }
}
//conn.app.use(redirectSec);

/*conn.app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});*/

///////////////////////////hotel/////////////////////////////
/////////////////////////////////////////////////////////////
conn.app.get('/hotel', auth.isLoggedInAdmin, function(req, res) {
    res.sendFile(__dirname + '/views/hotel/index.html');
});

conn.app.get('/hotel/login', function(req, res) {
    res.sendFile(__dirname + '/views/hotel/login.html');
});

conn.app.post('/hotel/login', auth.passport.authenticate('master-login', {
    successRedirect: '/hotel',
    failureRedirect: '/hotel/login',
    failureMessage: "Invalid username or password"
}));

conn.app.post('/hotel/guest_signup', auth.passport.authenticate('guest-sign', {
    successRedirect: '/hotel/#/guests',
    failureRedirect: '/hotel/#/guests/create_guest',
    failureMessage: "Invalid username or password"
}));

conn.app.get('/hotel/guest_passw_change/:id', auth.isLoggedInAdmin, function(req, res) {
    var newUser = new auth.User();
    var password = Math.random().toString(36).slice(-8);
    var hash = newUser.generateHash(password);
    auth.User.findOneAndUpdate({
        '_id' : req.params.id
    }, {'guest.password': hash }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/services');
        } else {
            var message = "New Password: " + password;
            mail.sent(user.guest.username, user.guest.email, message);
            res.redirect('/hotel/#/guests');
        }
    });
});

conn.app.get('/hotel/guest_drop/:id', auth.isLoggedInAdmin, function(req, res) {
    auth.User.findOneAndRemove({
        '_id' : req.params.id
    }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/services');
        } else res.redirect('/hotel/#/guests');
    });
});

conn.app.get('/hotel/seller_drop/:id', auth.isLoggedInAdmin, function(req, res) {
    auth.User.findOneAndRemove({
        'seller.username' : req.params.id
    }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/guests');
        } else res.redirect('/hotel/#/settings');
    });
});
/////////////////////modify seller members//////////////////////////////////////////
conn.app.post('/hotel/seller_change/:id', auth.isLoggedInAdmin, function(req, res) {
    var newUser = new auth.User();
    var hash = newUser.generateHash(req.body.password);
    auth.User.findOneAndUpdate({
        'seller.username' : req.params.id
    }, {'seller.username': req.body.username, 'seller.password': hash},
                               function(err, user) {
        if (err){
            res.redirect('/hotel/#/settings');
        } else {
            res.redirect('/hotel/#/settings');
        }
    });
});

conn.app.post('/hotel/seller_signup', auth.passport.authenticate('seller-sign', {
    successRedirect: '/hotel/#/settings',
    failureRedirect: '/hotel/#/settings/create_seller',
    failureMessage: "Invalid username or password"
}));

conn.app.get('/hotel/logout', function(req, res) {
    req.logout();
    res.redirect('/hotel');
});
/////////////////////////////////////////////////////////////
/////////////////////////user//////////////////////////////
///////////////////////////////////////////////////////////
conn.app.get('/user', auth.isLoggedInGuest, function(req, res) {
    res.sendFile(__dirname + '/views/user/index.html');
});

conn.app.get('/user/login', function(req, res) {
    res.sendFile(__dirname + '/views/user/login.html');
});
conn.app.post('/user/login', auth.passport.authenticate('guest-login', {
    successRedirect: '/user',
    failureRedirect: '/user/login',
    failureMessage: "Invalid username or password"
}));

conn.app.post('/user/token', function(req, res, done){
    auth.User.findOne({
        'guest.username': req.body.username
    }, function(err, user) {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, {
                message: 'Wrong Username.'
            });
        if (!user.validPasswordGuest(req.body.password))
            return done(null, false, {
                message: 'Wrong Username.'
            });
        var profile = {
            name: user.guest.username,
            email: user.guest.email,
            id: user._id,
            hcode: user.guest.hcode,
            room: user.guest.room,
            spot: user.guest.spot,
        };
        var token = auth.jwt.sign(profile, 'secret', { expiresInMinutes: 60*5 });
        res.json({ token: token });
    });
});

conn.app.get('/user/logout', function(req, res) {
    req.logout();
    res.redirect('/user');
});
conn.app.post('/user/book/:id', auth.isLoggedInGuest, function(req, res) {
    services.Service.findOne({
        'service.name' : req.params.id, 
    },
                             function(err, user) {
        if (err){
            res.redirect('/user/#/eeeee');
        } else {
            var newService = new services.Service();
            newService.order.hcode = req.user.guest.hcode;
            newService.order.room = req.user.guest.room;
            newService.order.name = req.params.id;
            newService.order.message = req.body.message;
            newService.order.people = req.body.people;
            newService.order.members = user.service.members;
            newService.order.price = user.service.price;
            newService.save();    
        }
    });    
    res.redirect('/user/#');
});

//////////////////////////////////////////////////////////////////////
/////////////////////////seller//////////////////////////////
///////////////////////////////////////////////////////////
conn.app.get('/seller', auth.isLoggedInTeam, function(req, res) {
    res.sendFile(__dirname + '/views/seller/index.html');
});

conn.app.get('/seller/login', function(req, res) {
    res.sendFile(__dirname + '/views/seller/login.html');
});

conn.app.post('/seller/login', auth.passport.authenticate('seller-login', {
    successRedirect: '/seller',
    failureRedirect: '/seller/login',
    failureMessage: "Invalid username or password"
}));
conn.app.get('/seller/logout', function(req, res) {
    req.logout();
    res.redirect('/seller');
});
conn.app.post('/seller/confirm_service/:id', auth.isLoggedInTeam, function(req, res) {
    services.Service.findOne({
        _id : req.params.id
    },
                             function(err, user) {
        if (err){
            res.redirect('/user/#/eeeee');
        } else {
            var newService = new services.Service();
            newService.order_bak.hcode = user.order.hcode;
            newService.order_bak.room = user.order.room;
            newService.order_bak.name = user.order.name;
            newService.order_bak.message_user = user.order.message;
            newService.order_bak.date = user.order.date;
            newService.order_bak.people = user.order.people;
            newService.order_bak.members = user.order.members;
            newService.order_bak.message = 'The order ' + user.order.name + ' is confirmed.\r\n' + req.body.message; 
            newService.save();    
        }
    }); 
    services.Service.findOneAndRemove({
        _id : req.params.id
    }, function(err, user) {
        if (err){
            //    res.redirect('/hotel/#/guests');
        }
    });    
    res.redirect('/seller/#');
});
conn.app.post('/seller/reject_service/:id', auth.isLoggedInTeam, function(req, res) {
    services.Service.findOne({
        _id : req.params.id
    },
                             function(err, user) {
        if (err){
            res.redirect('/user/#/eeeee');
        } else {
            var newService = new services.Service();
            newService.order_bak.hcode = user.order.hcode;
            newService.order_bak.room = user.order.room;
            newService.order_bak.name = user.order.name;
            newService.order_bak.message = user.order.message;
            newService.order_bak.date = user.order.date;
            newService.order_bak.members = user.order.members;
            newService.order_bak.message = 'The order ' + user.order.name + ' is rejected.\r\n' + req.body.message; 
            newService.save();    
        }
    });
    services.Service.findOneAndRemove({
        _id : req.params.id
    }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/guests');
        }
    });
    res.redirect('/seller/#');
});
//////////////////////////////////////////////////////////////////////
conn.app.post('/contact', function(req, res){
    var newEmail = auth.Metrix();
    newEmail.email.email = req.body.email;
    newEmail.email.ipaddress = requestIp.getClientIp(req);
    newEmail.save();
    res.redirect('/');
});
///////////////////////////////////////////////////////////////////
conn.app.post('/hotel/create_service', function(req, res){
    var newService = services.Service();
    newService.service.hcode = req.user.hotel.hcode;
    newService.service.name = req.body.name;
    newService.service.description = req.body.description;
    newService.save();
    res.redirect('/hotel/#/services');
});
conn.app.post('/hotel/confirm_service/:id', auth.isLoggedInAdmin, function(req, res) {
    services.Service.findOne({
        _id : req.params.id
    },
                             function(err, user) {
        if (err){
            res.redirect('/user/#/eeeee');
        } else {
            var newService = new services.Service();
            newService.order_bak.hcode = user.order.hcode;
            newService.order_bak.room = user.order.room;
            newService.order_bak.name = user.order.name;
            newService.order_bak.message_user = user.order.message;
            newService.order_bak.date = user.order.date;
            newService.order_bak.members = user.order.members;
            newService.order_bak.message = 'The order ' + user.order.name + ' is confirmed.\r\n' + req.body.message; 
            newService.save();    
        }
    }); 
    services.Service.findOneAndRemove({
        _id : req.params.id
    }, function(err, user) {
        if (err){
            //    res.redirect('/hotel/#/guests');
        }
    });    
    res.redirect('/hotel/#');
});
conn.app.post('/hotel/reject_service/:id', auth.isLoggedInAdmin, function(req, res) {
    services.Service.findOne({
        _id : req.params.id
    },
                             function(err, user) {
        if (err){
            res.redirect('/user/#/eeeee');
        } else {
            var newService = new services.Service();
            newService.order_bak.hcode = user.order.hcode;
            newService.order_bak.room = user.order.room;
            newService.order_bak.name = user.order.name;
            newService.order_bak.message = user.order.message;
            newService.order_bak.date = user.order.date;
            newService.order_bak.members = user.order.members;
            newService.order_bak.price = user.order.price;
            newService.order_bak.message = 'The order ' + user.order.name + ' is rejected.\r\n' + req.body.message; 
            newService.save();    
        }
    });
    services.Service.findOneAndRemove({
        _id : req.params.id
    }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/guests');
        }
    });
    res.redirect('/hotel/#');
});
conn.app.get('/hotel/service_drop/:id', auth.isLoggedInAdmin, function(req, res) {
    services.Service.findOneAndRemove({
        '_id' : req.params.id
    }, function(err, user) {
        if (err){
            res.redirect('/hotel/#/guests');
        } else res.redirect('/hotel/#/services');
    });
});
conn.app.post('/hotel/service_change/:id', auth.isLoggedInAdmin, function(req, res) {
    services.Service.findOneAndUpdate({
        '_id' : req.params.id
    }, {'service.name': req.body.name, 'service.description': req.body.description},
                                      function(err, user) {
        if (err){
            res.redirect('/hotel/#/services');
        } else {
            res.redirect('/hotel/#/services');
        }
    });
});
conn.app.post('/hotel/service_members/:id', auth.isLoggedInAdmin, function(req, res) {
    var list = "";
    if (req.body.list != null) list = req.body.list;
    else list = -1;
    services.Service.findOneAndUpdate({
        'service.name' : req.params.id
    }, {'service.members': null, 'service.members': list},
                                      function(err, user) {
        if (err){
            res.redirect('/hotel/#/service/'+ req.params.id);
        } else {
            res.redirect('/hotel/#/service/'+ req.params.id);
        }
    });
});
conn.app.post('/hotel/service_categories/:id', auth.isLoggedInAdmin, function(req, res) {
    var list = "";
    if (req.body.list != null) list = req.body.list;
    else list = -1;
    services.Service.findOneAndUpdate({
        'service.name' : req.params.id
    }, {'service.categories': null, 'service.categories': list},
                                      function(err, user) {
        if (err){
            res.redirect('/hotel/#/service/'+ req.params.id);
        } else {
            res.redirect('/hotel/#/service/'+ req.params.id);
        }
    });
});

conn.app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/test/index.html');
});
conn.app.get('/demo', function(req, res) {
    res.sendFile(__dirname + '/views/demo/index.html');
});

///////////////////////json/////////////////////////////////////////
api.apiRoutes();
/////////////////////////////////////////////////
///////////////////////////////////////////////////////////7////
//conn.app.use(express.static(__dirname + '/static'));
conn.app.use(express.static(__dirname + '/static/test'));

conn.app.listen(conn.port, conn.ipaddress, function() {
    console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), conn.ipaddress, conn.port);
});