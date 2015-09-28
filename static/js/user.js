//search    
var searched = function(){
    $(document).ready(function() {
        $('#search').hideseek({
            highlight: true,
            nodata: 'No results found'
        });
    });
};
// set title in the /hotel
var getTitle = function() {
    $.get('/user/api/user_name', function(data) {
        $('#title_user').text('ROOM ' + data);
    });
};
var getCode = function() {
    $.get('/user/api/user_code', function(data) {
        $('head').append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/hotels/" + data + "/css/hotel.css\">");
        $('html, body').css('background', "url(/hotels/" + data + "/img/background.jpg) no-repeat center center fixed");
    });
};
// /hotel/#/services
var getListServices = function() {
    $.getJSON('/user/api/services', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li><a href=\"/user/#/service/" + data[i].service.name + "\"><img src=\"" + data[i].service.image + "\"><h3 style=\"display: none;\">" + data[i].service.name + "</h3></a></li>";
        }
        $("#listc").html(output);
    });
    searched();
};
var getListServicesCategory = function() {
    var id = window.location.href.split('/').pop();
    $.getJSON('/user/api/services/category/' + id, function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li><a href=\"/user/#/service/" + data[i].service.name + "\"><img src=\"" + data[i].service.image + "\"><h3 style=\"display: none;\">" + data[i].service.name + "</h3></a></li>";
        }
        $("#listcc").html(output);
    });
    searched();
};

var getMessages = function() {
    $.getJSON('/user/api/messages', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li><h3>" + data[i].order_bak.message + "</h3></li>";
        }
        $("#settingz").html(output);
    });
    searched();
};

var getService = function() {
    var id = window.location.href.split('/').pop();
        $.getJSON('/user/api/service/' + id, function(data) {
            var output = "";
            output += "<li><img src=\"" + data.service.image + "\"></li>"+ data.service.description;
            $("#listf").html(output);
        });
    $("#booker").attr("action", '/user/book/' + id);
};

getTitle(); getCode();
setInterval(getMessages, 2000);
