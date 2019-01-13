const socket = new WebSocket("wss://eu.pug.champ.gg/socket.io/?EIO=3&transport=websocket");
let heartbeatCount = 1;

socket.addEventListener("message", function (event) {
    onMessage(event)
});

heartbeat();

function onMessage(evt) {
    let msg_text = evt.data;
    if (isLaunchStatusUpdate(msg_text)){
        msg_text = msg_text.replace(/^\d+/, '');    //remove leading numbers from json
        let obj = JSON.parse(msg_text);             //convert to json
        let class_player_dict = obj[1].playersAvailable;
        let all_players_available = obj[1].allPlayersAvailable.length;
        updateIcon(all_players_available);
    }
}

function isLaunchStatusUpdate(msg_text){
    return msg_text.includes("launchStatusUpdated");
}

function heartbeat() {
  setTimeout(function(){
    socket.send('42["timesync",{"jsonrpc":"2.0","id":" + heartbeatCount + ","method":"timesync"}]');
    heartbeatCount++;
    heartbeat()
  }, 4000);
}

function updateIcon(all_players_available) {
  chrome.browserAction.setBadgeBackgroundColor({color:[235, 30, 30, 230]});
  chrome.browserAction.setBadgeText({text: "" + all_players_available});
}
