// Contains the code for the popup user interface.
// Users will be able to disable and enable color coding and automatic name substitutions
console.log("Popup script activated.")
sendTestMessage();


// This has to be in a onload block so it only executes when the html is loaded, otherwise it can't find the elements
window.onload = function () {
  let settings = getSettings();
  let toggleColorCoding = document.getElementById('toggleColorCoding');
  let toggleNameSubstitution = document.getElementById('toggleNameSubstitution');

  toggleColorCoding.onclick = function () {
    console.log("colorcodingclicked");
    settings.divTags = !settings.divTags;
    setColor(settings.divTags, toggleColorCoding);
    setSettings();
  };

  toggleNameSubstitution.onclick = function () {
    console.log("namesubclicked");
    settings.nameSubstitution = !settings.nameSubstitution;
    setColor(settings.nameSubstitution, toggleNameSubstitution);
    setSettings();
  };

  function getSettings() {
    chrome.storage.sync.get("settings", function (data) {
      settings = data.settings;
      setColor(settings.divTags, toggleColorCoding);
      setColor(settings.nameSubstitution, toggleNameSubstitution);
    });
  }
  function setSettings() {
    chrome.storage.sync.set({settings: settings}, function() {
    });
  }
}

function rgb(r,g,b) {
    return 'rgb(' + [(r||0),(g||0),(b||0)].join(',') + ')';
}

function setColor(enabled, element){
  if (enabled){
    element.style.backgroundColor = rgb(66, 134, 244);
  } else {
    element.style.backgroundColor = rgb(244, 65, 95);
  }
}

function toggleCheckBox(){

}

//Recieving end of Websocket to popup messages
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.title == "class_player_dict") {
      refreshPlayerData(request.content);
    }
  }
);

function refreshPlayerData(class_player_dict){
  //TODO use data recieved from message to update popup
}

//Send message
function sendTestMessage(){
  chrome.runtime.sendMessage({ greeting: "hello" });
}
