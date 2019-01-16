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
  //let btnNameSubstitution = document.getElementById('btnNameSubstitution');
  let btnRegionEU = document.getElementById('btnRegionEU');
  let btnRegionNA = document.getElementById('btnRegionNA');
  let btnRegionAU = document.getElementById('btnRegionAU');

  btnRegionEU.onclick = function () {
    settings.region = "eu";
    setSettings();
    settingsUpdated();
    selectRegion("eu")
  };

  btnRegionNA.onclick = function () {
    settings.region = "na";
    setSettings();
    settingsUpdated();
    selectRegion("na")
  };

  btnRegionAU.onclick = function () {
    settings.region = "au";
    setSettings();
    settingsUpdated();
    selectRegion("au")
  };

  btnDivTags.onclick = function () {
    settings.divTags = !settings.divTags;
    setColor(settings.divTags, btnDivTags);
    setSettings();
  };

  /*btnNameSubstitution.onclick = function () {
    settings.nameSubstitution = !settings.nameSubstitution;
    setColor(settings.nameSubstitution, btnNameSubstitution);
    setSettings();
  };*/

  function selectRegion(region) {
    let selected = "#4caf50";
    let unselected = "#9E9E9E";

    btnRegionEU.style.backgroundColor = unselected;
    btnRegionNA.style.backgroundColor = unselected;
    btnRegionAU.style.backgroundColor = unselected;

    if (region == "eu") {
      btnRegionEU.style.backgroundColor = selected;
    } else if (region == "na") {
      btnRegionNA.style.backgroundColor = selected;
    } else {
      btnRegionAU.style.backgroundColor = selected;
    }
  }

  function getSettings() {
    chrome.storage.sync.get("settings", function (data) {
      settings = data.settings;
      setColor(settings.divTags, btnDivTags);
      selectRegion(settings.region)
    });
  }
  function setSettings() {
    console.log(settings);
    chrome.storage.sync.set({settings: settings}, function() {
    });
  }
}

function setColor(enabled, element){
  if (enabled){
    element.style.backgroundColor = "#4caf50";
  } else {
    element.style.backgroundColor = "#9E9E9E";
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
