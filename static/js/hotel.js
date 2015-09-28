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
    $("#book_resp").attr("action", '/hotel/confirm_service/' + id);
}
var double_button_ko = function(){
    var id = window.location.href.split('/').pop();
    $("#book_resp").attr("action", '/hotel/reject_service/' + id);
}

// set title in the /hotel
var getTitle = function() {
    $.get('/hotel/api/hotel_name', function(data) {
        $('#title_hotel').text(data);
    });
};
// list of guests in /hotel/#/guests
var getListGuest = function() {
    $.getJSON('/hotel/api/users', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/hotel/#/guest/" + data[i].guest.username + "\">" + data[i].guest.room + " " + data[i].guest.email + "</a></li>";
        }
        $('#lista').html(output);
    });
    searched();
};
//  single guest /hotel/#/guest/OPH_667
var getGuest = function() {
    var id = window.location.href.split('/').pop(); // split url and get last piece
    $.getJSON('/hotel/api/user/' + id, function(data) {
        var output = "";
        output += data.guest.username + " <a href='/hotel/guest_passw_change/" + data.guest.username + "' onclick=\"return confirm('Are you sure you want to send new password?')\">Change Password</a> <a href='/hotel/guest_drop/" + data.guest.username + "' onclick=\"return confirm('Are you sure you want to delete?')\">Delete</a>";
        $('#listd').html(output);
    });
};
// /hotel/#/settings 
var getListTeam = function() {
    $.getJSON('/hotel/api/sellers', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/hotel/#/setting/" + data[i].seller.username + "\">" + data[i].seller.username + "</a></li>";
        }
        $("#listb").html(output);
    });
    searched();
};
// sigle seller member /hotel/#/setting/234
var getTeam = function() {
    var id = window.location.href.split('/').pop();
    $.getJSON('/hotel/api/seller/' + id, function(data) {
        var output = "";
        output += data.seller.username + " <a href='/hotel/#/setting/" + data.seller.username + "/change'>Change</a> <a href='/hotel/seller_drop/" + data.seller.username + "' onclick=\"return confirm('Are you sure you want to delete?')\">Delete</a>";
        $("#liste").html(output);
    });
};
// edit seller member /hotel/#/setting/234/change
var changeTeam = function() {
    var id = window.location.href.split('/')[6];
    $('#listg').attr("action", '/hotel/seller_change/' + id);
};
// /hotel/#/services
var getListServices = function() {
    $.getJSON('/hotel/api/services', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/hotel/#/service/" + data[i].service.name + "\"><img src=\"" + data[i].service.image + "\"><h3 style=\"display: none;\">" + data[i].service.name + "</h3></a></li>";
        }
        $("#listc").html(output);
    });
    searched();
};
// single service /hotel/#/service/due
var getService = function() {
    var members = ""; var categories = ['sport', 'food', 'living', 'culture', 'confort'];
    var id = window.location.href.split('/').pop();
    $.getJSON('/hotel/api/service/' + id, function(data) {
       // document.write(categories.length);
        members = data.service.members;
        var output = "";
        output += data.service.name + " " + data.service.description + " <a href='/hotel/#/service/" + data.service.name + "/change'>Change</a> <a href='/hotel/service_drop/" + data.service.name + "' onclick=\"return confirm('Are you sure you want to delete?')\">Delete</a>";
        $("#listf").html(output);
        var outputList = "<select multiple=\"multiple\" size=\"10\" name=\"list\">"; //dual list
        for(var i = 0; i < categories.length; i++){
            outputList += "<option value=\"" + categories[i] + "\"";
            if($.inArray(categories[i], data.service.categories) > -1 ){
               outputList += " selected=\"selected\" ";
            }
            outputList += ">" + categories[i] + "</option>";  
        };        
        outputList += "</select><br><button type=\"submit\" class=\"btn btn-default btn-block\">Submit data</button>";
        $('#doubleC').html(outputList);
        list('[name=list]');
        $("#doubleC").attr("action", '/hotel/service_categories/' + id);
    });
    $.getJSON('/hotel/api/sellers', function(data) {
        var outputList = "<select multiple=\"multiple\" size=\"10\" name=\"list\">"; //dual list 
        for (var i = 0; i < data.length; i++) {
            outputList += "<option value=\"" + data[i].seller.username + "\"";
            if ( $.inArray(data[i].seller.username, members) > -1 ) {
                outputList += " selected=\"selected\" ";
            }
            outputList += ">" + data[i].seller.username + "</option>"
        };
        outputList += "</select><br><button type=\"submit\" class=\"btn btn-default btn-block\">Submit data</button>";
        $('#doubleT').html(outputList);
        list('[name=list]');
        $("#doubleT").attr("action", '/hotel/service_members/' + id);
    });
};
// edit single service /hotel/#/service/due/change
var changeService = function() {
    var id = window.location.href.split('/')[6];
    $("#listh").attr("action", '/hotel/service_change/' + id);
};
/// function for bootstrap dual list box
var list = function(tag) {
    $(tag).bootstrapDualListbox({
        nonSelectedListLabel: 'Non-selected',
        selectedListLabel: 'Selected',
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false
    })
};
// /hotel/#/
var getMessages = function() {
    $.getJSON('/hotel/api/messages', function(data) {
        var output = "";
        for (var i = 0; i < data.length; i++) {
            output += "<li class=\"list-group-item\"><a href=\"/hotel/#/message/" + data[i]._id + "\"> Room: " + data[i].order.room + " Service: " + data[i].order.name + "</a></li>";
        }
        $("#messages").html(output);
        if (data.length > 0) $(".navbar-default").attr("style", 'background-color: red;');
        else $(".navbar-default").attr("style", 'background-color: #rgba(0, 0, 0, .3);');
    });
};
var getMessage = function() {
    var id = window.location.href.split('/').pop();
    $.getJSON('/hotel/api/message/' + id, function(data) {
        var output = "";
        output += "<li class=\"list-group-item\">Room: " + data.order.room + " Service: " + data.order.name + "</li>";
        $("#message").html(output);
    });
};
// title called
getTitle();
setInterval(getMessages, 2000);
