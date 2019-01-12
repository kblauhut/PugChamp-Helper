var WebSocket = require('ws')


var wsUri = "wss://eu.pug.champ.gg/socket.io/?EIO=3&transport=websocket";

console.log("hi there love.");

function testWebSocket() {
    websocket = new WebSocket(wsUri);

    websocket.onopen = function (evt) {
        onOpen(evt)
    };

    websocket.onmessage = function (evt) {
        onMessage(evt)
    };

    websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen(evt) {
    console.log("Connection opened.");
    doSend("WebSocket rocks");
}

function onMessage(evt) {
    console.log("Message received.");
    websocket.close();
}

function onError(evt) {
    console.log("Error!");
}

function doSend(message) {
    console.log("Sending message.");
    websocket.send(message);
}

testWebSocket();