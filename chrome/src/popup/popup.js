// Contains the code for the popup user interface.
// Users will be able to disable and enable color coding and automatic name substitutions

//Colors for buttons
const colorSelected = "#4caf50";
const colorUnselected = "#9E9E9E";
let regionButtonMap = {};


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

  regionButtonMap = {"eu": btnRegionEU, "na": btnRegionNA, "au": btnRegionAU};
  let regionButtons = [btnRegionAU, btnRegionEU, btnRegionNA];

  //functions to manipulate region buttons
  //Remove selection class from all buttons
  function clearSelection() {
    for (i = 0; i < regionButtons.length; i++) {
      unselectButton(regionButtons[i]);
    }
  }
  function unselectButton(button) {
    if (button.classList.contains('btn-success')) {
      button.classList.remove('btn-success');
    }
    button.classList.add('btn-secondary');
  }

  //Change color to indicate which is selected (can also be done with bootstrap button groups, something for later?)
  function selectRegionButton(button) {
    clearSelection();

    button.classList.add('btn-success');
    button.classList.remove('btn-secondary');
  }

  //Set color of one button
  function updateButton(enabled, button) {
    unselectButton(button); //remove success and add secondary
    if (enabled) {
      button.classList.add('btn-success');
      button.classList.remove('btn-secondary');
    }
  }



  //These onclick functions will now pass the button that needs to be selected as paramater 
  btnRegionEU.onclick = function () {
    settings.region = "eu";
    setSettings();
    settingsUpdated();
    selectRegion("eu");
  };

  btnRegionNA.onclick = function () {
    settings.region = "na";
    setSettings();
    settingsUpdated();
    selectRegion("na");
  };

  btnRegionAU.onclick = function () {
    settings.region = "au";
    setSettings();
    settingsUpdated();
    selectRegion("au");
  };



  btnDivTags.onclick = function () {
    settings.divTags = !settings.divTags;
    updateButton(settings.divTags, btnDivTags);
    setSettings();
  };

  /*btnNameSubstitution.onclick = function () {
    settings.nameSubstitution = !settings.nameSubstitution;
    updateButton(settings.nameSubstitution, btnNameSubstitution);
    setSettings();
  };*/

  function selectRegion(region) {
    selectRegionButton(regionButtonMap[region]);
  }

  function getSettings() {
    chrome.storage.sync.get("settings", function (data) {
      settings = data.settings;
      updateButton(settings.divTags, btnDivTags);
      selectRegion(settings.region)
    });
  }
  function setSettings() {
    chrome.storage.sync.set({ settings: settings }, function () {
    });
  }
}

function toggleCheckBox() {

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
