var socket = null; stompClient = null;

$(document).ready(function () {
    //connect();

    $.ajax({
        url: "http://localhost:3000",
        dataType: "json",
        async: false,
        success: function(data){
            alert("Success");
        },
        error: function (httpRequest, textStatus, errorThrown) {
            alert("Error: " + httpRequest);

        }
    });

});

function connect() {
    socket = new SockJS("http://localhost:3000");

    socket.onopen = function() {
        console.log("Socked opened");
    };

    socket.onclose = function() {
        console.log("Socked closed");
    };

    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("StompClient connected");

        stompClient.subscribe('/topic/agents/request/message/info', function (data) {
            data = JSON.parse(data.body);

            console.log("Received message");
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
}

// Create a connection to http://localhost:9999/echo
/*var sock = new SockJS("http://localhost:9999/echo");

// Open the connection
sock.onopen = function() {
    console.log("Socked opened");
};

// On connection close
sock.onclose = function() {
    console.log("Socked closed");
};

// On receive message from server
sock.onmessage = function(e) {
    console.log("Socket onmessage");

    // Get the content
    var content = JSON.parse(e.data);

    // Append the text to text area (using jQuery)
    $('#chat-content').val(function(i, text){
        return text + "User " + content.username + ": " + content.message + "\n";
    });

};

// Function for sending the message to server
function sendMessage(){
    console.log("Socket sendMessage");

    // Get the content from the textbox
    var message = $("#message").val();
    var username = $("#username").val();

    // The object to send
    var send = {
        message: message,
        username: username
    };

    // Send it now
    sock.send(JSON.stringify(send));
}*/