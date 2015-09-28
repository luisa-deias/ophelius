var express = require('express');
var app = express();
/********** severs caracters *********************/
var ipaddress = '127.0.0.1';
var port = 3001;

// default to a 'localhost' configuration:
var connectionString = 'localhost/simple';

exports.ipaddress = ipaddress;
exports.port = port;
exports.connectionString = connectionString;
exports.app = app;
