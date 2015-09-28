var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var serviceSchema = new Schema({ // services scheme
    service: {
        hcode: String,
        name: [String], 
        image: String,
        image_big: String,
        description: [String],
        description_big: [String],
        members: [String], // team members assigned to service
        categories: [String],
        price : String,
        day : [Date],
        people : [String],
        coach : [String],
        prices : [String],
        items : [String],
        reserve: String
    },
    
    order : {
        hcode: String,
        room: String,
        name: String,
        message: String,
        members: [String],
        price : String,
        people: String,
        date: { type: Date, default: Date.now }
    },
    
    order_bak : {
        hcode: String,
        room: String,
        name: String,
        message: String,
        message_user: String,
        members: [String],
        price : String,
        people: String,
        date: Date,   
        servedBy: String
    }
});

var Service = mongoose.model('Service', serviceSchema, 'serviceSchema');

exports.Service = Service;