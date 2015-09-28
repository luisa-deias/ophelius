//search    
var searched = function(){
    $(document).ready(function() {
        $('#search').hideseek({
            highlight: true,
            nodata: 'No results found'
        });
    });
};

var double_button_ok = function(){
    var id = window.location.href.split('/').pop();
    $("#book_resp").attr("action", '/seller/confirm_service/' + id);
}
var double_button_ko = function(){
    var id = window.location.href.split('/').pop();
    $("#book_resp").attr("action", '/seller/reject_service/' + id);
}


// set title in the /hotel
var getTitle = function() {
    $.get('/seller/api/seller_name', function(data) {
        $('#title_seller').text(data);
    });
};
// /hotel/#/services
var getListServices = function() {
    $.getJSON('/seller/api/services', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/seller/#/service/" + data[i].service.name + "\">" + data[i].service.name + "</a></li>";
        }
        $("#listc").html(output);
    });
    searched();
};

var getService = function() {
    var id = window.location.href.split('/').pop();
        $.getJSON('/seller/api/service/' + id, function(data) {
            var output = "";
            output += data.service.name + " " + data.service.description + " <a href='/hotel/#/service/" + data.service.name + "/change'>Change</a> <a href='/hotel/service_drop/" + data.service.name + "' onclick=\"return confirm('Are you sure you want to delete?')\">Delete</a>";
            $("#listf").html(output);
        });
};

// /hotel/#/
var getMessages = function() {
    $.getJSON('/seller/api/messages', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/seller/#/message/" + data[i]._id + "\"> Room: " + data[i].order.room + " Service: " + data[i].order.name + "</a></li>";
        }
        $("#messages").html(output);
        if (data.length > 0) $(".navbar-default").attr("style", 'background-color: red;');
        else $(".navbar-default").attr("style", 'background-color: #202020;');
    });
};

var getMessage = function() {
    var id = window.location.href.split('/').pop();
    $.getJSON('/seller/api/message/' + id, function(data) {
        var output = "";
        output += "<li class=\"list-group-item\">Room: " + data.order.room + " Service: " + data.order.name + "</li>";
        $("#message").html(output);
    });
};

getTitle();
setInterval(getMessages, 2000);
