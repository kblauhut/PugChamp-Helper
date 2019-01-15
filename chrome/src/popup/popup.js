// Contains the code for the popup user interface.
// Users will be able to disable and enable color coding and automatic name substitutions
console.log("Popup script activated.")

let toggleColorCoding = document.getElementById('toggleColorCoding');
let toggleNameSubstitution = document.getElementById('toggleNameSubstitution');

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

chrome.storage.sync.get('colorCoding', function(data) {
  setColor(data.colorCoding, toggleColorCoding);
  toggleColorCoding.onclick = function(){
    console.log("colorcodingclicked");
  };
 });

chrome.storage.sync.get('nameSubstitution', function(data) {
  setColor(data.nameSubstitution, toggleNameSubstitution);
  toggleNameSubstitution.onclick = function(){
    console.log("namesubclicked");
  };
});

//Recieving end of Websocket to popup messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.title == "class_player_dict"){
      refreshPlayerData(request.content);
    }
  }
);

function refreshPlayerData(class_player_dict){
  //TODO use data recieved from message to update popup
}