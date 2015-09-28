var auth = require('./auth');
var conn = require('./conn.js');
var services = require('./services.js');


exports.apiRoutes = function(){
    //hotel name
    conn.app.get('/hotel/api/hotel_name', auth.isLoggedInAdmin, function(req, res){
        res.send(req.user.hotel.name);
    });
    //list of guests of hotel
    conn.app.get('/hotel/api/users',auth.isLoggedInAdmin, function(req, res){
        return auth.User.find({'guest.hcode': req.user.hotel.hcode}, '-__v -guest.password -guest.hcode', function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    });
    // single guest
    conn.app.get('/hotel/api/user/:id',auth.isLoggedInAdmin, function(req, res){
        return auth.User.findOne({'_id': req.params.id}, '-__v -guest.password -guest.hcode', function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    });    
    //list of sellers
    conn.app.get('/hotel/api/sellers',auth.isLoggedInAdmin, function(req, res){
        return auth.User.find({'seller.hcode': req.user.hotel.hcode}, '-_id -__v -seller.password -seller.hcode', function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    });    
    //single seller member
    conn.app.get('/hotel/api/seller/:id',auth.isLoggedInAdmin, function(req, res){
        return auth.User.findOne({'seller.username': req.params.id}, '-_id -__v -seller.password -seller.hcode', function (err, users) {
            if (!err) {
                return res.send(users);
            } else {
                return console.log(err);
            }
        });
    });       
    //list of services
    conn.app.get('/hotel/api/services',auth.isLoggedInAdmin, function(req, res){
        return services.Service.find({'service.hcode': req.user.hotel.hcode}, '-__v -service.hcode', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    }); 
    //single service
    conn.app.get('/hotel/api/service/:id',auth.isLoggedInAdmin, function(req, res){
        return services.Service.findOne({'_id': req.params.id}, '-__v -service.hcode', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });  
    //seller name
    conn.app.get('/seller/api/seller_name', auth.isLoggedInTeam, function(req, res){
        res.send(req.user.seller.username);
    });    
    //list of services for seller member
    conn.app.get('/seller/api/services',auth.isLoggedInTeam, function(req, res){
        return services.Service.find({'service.hcode': req.user.seller.hcode, 'service.members': req.user.seller.username}, '-_id -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });     
    //single service for seller member
    conn.app.get('/seller/api/service/:id',auth.isLoggedInTeam, function(req, res){
        return services.Service.findOne({'service.name': req.params.id, 'service.members': req.user.seller.username}, '-_id -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    }); /*
    //user name
    conn.app.get('/user/api/user_name', auth.isLoggedInGuest, function(req, res){
        res.send(req.user.guest.room);
    });      
    conn.app.get('/user/api/user_code', auth.isLoggedInGuest, function(req, res){
        res.send(req.user.guest.hcode);
    });          
    //list of services for user
    conn.app.get('/user/api/services',auth.isLoggedInGuest, function(req, res){
        return services.Service.find({'service.hcode': req.user.guest.hcode}, '-_id -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });
    //list of services for user by category
    conn.app.get('/user/api/services/category/:id',auth.isLoggedInGuest, function(req, res){
        return services.Service.find({'service.hcode': req.user.guest.hcode, 'service.categories' : req.params.id}, '-_id -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });    
    conn.app.get('/user/api/messages',auth.isLoggedInGuest, function(req, res){
        return services.Service.find({'order_bak.hcode': req.user.guest.hcode, 'order_bak.room': req.user.guest.room}, '-_id -__v -order -service -order_bak.hcode -order_bak.room -order_bak.name -order_bak.members -order_bak.date -order_bak.servedBy', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });       
    conn.app.get('/user/api/service/:id',auth.isLoggedInGuest, function(req, res){
        return services.Service.findOne({'service.name': req.params.id}, '-_id -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });*/
    conn.app.get('/hotel/api/messages',auth.isLoggedInAdmin, function(req, res){
        return services.Service.find({'order.hcode': req.user.hotel.hcode}, '-__v -order.hcode -order_bak -service', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });     
    conn.app.get('/hotel/api/message/:id',auth.isLoggedInAdmin, function(req, res){
        return services.Service.findOne({_id: req.params.id}, '-__v -order.hcode -order_bak -service -_id', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });        
    //list of messages for seller member
    conn.app.get('/seller/api/messages',auth.isLoggedInTeam, function(req, res){
        return services.Service.find({'order.hcode': req.user.seller.hcode, 'order.members': req.user.seller.username}, '-__v -order.hcode -order.members -order_bak -service', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });
    conn.app.get('/seller/api/message/:id',auth.isLoggedInTeam, function(req, res){
        return services.Service.findOne({'order.hcode': req.user.seller.hcode, _id: req.params.id}, '-__v -order.hcode -order_bak -service -order.members -_id', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });
        ///////////////////////////////////////////////////////////////////////////////////77
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //list of services for user
    //user name   
    conn.app.get('/app/api/services',function(req, res){
        return services.Service.find({'service.hcode': req.user.hcode}, '-__v  -service.members -service.hcode -order -order_bak', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });
    conn.app.get('/app/api/messages', function(req, res){
        return services.Service.find({'order_bak.hcode': req.user.hcode, 'order_bak.room': req.user.room}, '-__v  -order_bak.members -order_bak.hcode -service -order', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });
    //list of services for user by category
    conn.app.get('/app/api/services/category/:categories', function(req, res){
        return services.Service.find({'service.hcode': req.user.hcode, 'service.categories' : req.params.categories}, ' -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });      
    conn.app.get('/app/api/message/:id', function(req, res){
        return services.Service.findOne({_id: req.params.id, 'order_bak.hcode': req.user.hcode, 'order_bak.room': req.user.room}, '-__v -order_bak.hcode -order -service -order_bak.members -_id', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });    
    conn.app.get('/app/api/service/:id', function(req, res){
        return services.Service.findOne({ _id: req.params.id, 'service.hcode': req.user.hcode}, ' -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });      
    conn.app.get('/app/api/spot', function(req, res){
        return services.Service.findOne({ _id: req.user.spot}, ' -__v -service.hcode -service.members', function (err, serv) {
            if (!err) {
                return res.send(serv);
            } else {
                return console.log(err);
            }
        });
    });  
conn.app.post('/app/book/:id', function(req, res) {
    services.Service.findOne({ '_id' : req.params.id },
        function(err, user) {
            if (err){
                res.redirect('/user/#/eeeee');
            } else {
                var newService = new services.Service();
                newService.order.hcode = user.service.hcode;
               // newService.order.room = req.session.room;
                newService.order.name = user.service.name;
              //  newService.order.message = req.body.message;
                newService.order.people = req.body.people;
                newService.order.members = user.service.members;
                newService.order.price = user.service.price;
                newService.save(); 
            }
    });    
});    
    
}