// Contains the code for the popup user interface.
// Users will be able to disable and enable color coding and automatic name substitutions

//load stylesheet
style = document.createElement("link");
style.rel = "stylesheet";
style.type = "text/css";
style.href = chrome.extension.getURL("res/css/popup.css");
document.head.appendChild(style);

// This has to be in a onload block so it only executes when the html is loaded, otherwise it can't find the elements
window.onload = function () {
  let settings = getSettings();
  let btnDivTags = document.getElementById('btnDivTags');
  let btnNameSubstitution = document.getElementById('btnNameSubstitution');
  let btnRegionEU = document.getElementById('btnRegionEU');
  let btnRegionNA = document.getElementById('btnRegionNA');
  let btnRegionAU = document.getElementById('btnRegionAU');

  btnRegionEU.onclick = function () {
    settings.region = "eu";
    setSettings();
    settingsUpdated();
  };

  btnRegionNA.onclick = function () {
    settings.region = "na";
    setSettings();
    settingsUpdated();
  };

  btnRegionAU.onclick = function () {
    settings.region = "au";
    setSettings();
    settingsUpdated();
  };

  btnDivTags.onclick = function () {
    settings.divTags = !settings.divTags;
    setColor(settings.divTags, btnDivTags);
    setSettings();
  };

  btnNameSubstitution.onclick = function () {
    settings.nameSubstitution = !settings.nameSubstitution;
    setColor(settings.nameSubstitution, btnNameSubstitution);
    setSettings();
  };

  function getSettings() {
    chrome.storage.sync.get("settings", function (data) {
      settings = data.settings;
      setColor(settings.divTags, btnDivTags);
      setColor(settings.nameSubstitution, btnNameSubstitution);
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

function refreshPlayerData(class_player_dict) {
  //TODO use data recieved from message to update popup
}

//Send message
function settingsUpdated() {
  chrome.runtime.sendMessage({ greetings: "hello" });
}
