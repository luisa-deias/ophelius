var email = require('emailjs/email');
var server = email.server.connect({
    user: "noreply",
    password: "qweasdzxc",
    host: "imap.ophelius.com",
    ssl: false
});

// send the message and get a callback with an error or details of the message that was sent
exports.sent = function(username, too, textt) {

    var message = {
        from: "Ophelius <noreply@ophelius.com>",
        to: username + " <" + too + ">",
        subject: 'Credentials - No reply',
        text: textt,
    };

    server.send(message, function(err, message) {
        if (err) {
            console.log(err.toString());
        } else {
            console.log("email sent.");
        }
    });

};