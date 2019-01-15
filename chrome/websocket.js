let socket;
let heartbeatCount;

getSettings();

function openSocket(region) {
  socket = new WebSocket("wss://" + region + ".pug.champ.gg/socket.io/?EIO=3&transport=websocket");

  socket.addEventListener("open", function (event) {
      heartbeat();
  });

  socket.addEventListener("message", function (event) {
      onMessage(event);
  });
}

function onMessage(evt) {
    let msg_text = evt.data;
    if (msg_text.includes("launchStatusUpdated")){
        msg_text = msg_text.replace(/^\d+/, '');    //remove leading numbers from json
        let obj = JSON.parse(msg_text);             //convert to json

        let class_player_dict = obj[1].playersAvailable;
        let all_players_available = obj[1].allPlayersAvailable.length;

        updatePopup(class_player_dict); //Send message to popup
        updateIcon(all_players_available);
    }
}

function heartbeat() {
  setTimeout(function(){
    if (socket.readyState = 1) {
      socket.send('42["timesync",{"jsonrpc":"2.0","id":"'+ heartbeatCount +'","method":"timesync"}]');
      heartbeatCount++;
    }
    heartbeat()
  }, 4000);
}

function updateIcon(all_players_available) {
  chrome.browserAction.setBadgeBackgroundColor({color:[235, 30, 30, 230]});
  chrome.browserAction.setBadgeText({text: "" + all_players_available});
}

// Send message to popup
function updatePopup(class_player_dict) {
    chrome.runtime.sendMessage(
        {
            title: "class_player_dict",
            content: class_player_dict
        }
    );
}

//Recieving end of messages
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      getSettings();
    }
);

function getSettings() {
  chrome.storage.sync.get("settings", function (data) {
    settings = data.settings;
    if (socket != undefined) socket.close();
    heartbeatCount = 1;
    openSocket(settings.region)
  });
}
