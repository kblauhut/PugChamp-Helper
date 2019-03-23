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

togglebutton = document.createElement("link");
togglebutton.rel = "stylesheet";
togglebutton.type = "text/css";
togglebutton.href = chrome.extension.getURL("res/css/togglebutton.css");
document.head.appendChild(togglebutton);

// This has to be in a onload block so it only executes when the html is loaded, otherwise it can't find the elements
window.onload = function () {
  let settings = getSettings();
  let divTagToggle = document.getElementById('divTagToggle');
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
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
    }
    button.classList.add('unselected');
  }

  //Change color to indicate which is selected (can also be done with bootstrap button groups, something for later?)
  function selectRegionButton(button) {
    clearSelection();

    button.classList.add('selected');
    button.classList.remove('unselected');
  }

  function updateDivToggle(enabled, toggleElement){
    $(toggleElement).prop("checked", enabled);
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


  divTagToggle.onclick = function () {
    settings.divTags = !settings.divTags;
    updateDivToggle(settings.divTags, divTagToggle);
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
      updateDivToggle(settings.divTags, divTagToggle)
      selectRegion(settings.region)
    });
  }
  function setSettings() {
    chrome.storage.sync.set({ settings: settings }, function () {
    });
  }
}


//Recieving end of Websocket to popup messages
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.title == "pugchamp_info") {
      refreshPlayerData(request.content);
    }
  }
);

function refreshPlayerData(json_info) {
    let playeramount = json_info[1].allPlayersAvailable.length;     //Amount of different players added up in total.
    let rolesneededamount = json_info[1].rolesNeeded.length;        //If this is empty then all the roles are filled.
    let captainsavailable = json_info[1].captainsAvailable.length;  //Amount of people added as captain


}

//Send message
function settingsUpdated() {
  chrome.runtime.sendMessage({ greetings: "hello" });
}
