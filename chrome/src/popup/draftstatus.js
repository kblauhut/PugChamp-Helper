var WebSocket = require('ws')
var wsUri = "wss://eu.pug.champ.gg/socket.io/?EIO=3&transport=websocket";

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
    
}

function onMessage(evt) {
    console.log("Message received.");
    let msg_text = evt.data;
    if (isLaunchStatusUpdate(msg_text)){
        msg_text = msg_text.replace(/^\d+/, '');    //remove leading numbers from json
        console.log(msg_text);
        let obj = JSON.parse(msg_text);             //convert to json
        let class_player_dict = obj[1].playersAvailable;
        console.log(class_player_dict);
    }
}

function isLaunchStatusUpdate(msg_text){
    return msg_text.includes("launchStatusUpdated");
}

function onError(evt) {
    console.log("An error occurred!");
    //TODO do we need to close connection here? Check in API
}

function doSend(message) {
    console.log("Sending a message.");
    websocket.send(message);
}

testWebSocket();