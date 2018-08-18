chrome.runtime.onInstalled.addListener(function() {
  console.log("onInstalled function called.");
  // TODO: Download player data from server.

  chrome.storage.sync.set({colorCoding: true, nameSubstitution: true}, function() {
      console.log("variables 'colorCoding' and nameSubstitution set to true. Should be accessible from anywhere in the extension now.");
    });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == "request") {
      var idArray = request.idArray;
      var divArray = etf2lAPI(idArray);
    } else if (request.message == "update") {

    }

});



function etf2lAPI(idArray) {
    var xhr = new XMLHttpRequest();
    var divArray = [];
    var arrayArray = [];
    var url;
    var tempArrayTeams;
    var tempArrayTeamType;
    var sixes = false;

    for (var i = 0; i < idArray.length; i++) {
      url = "http://api.etf2l.org/player/" + idArray[i] + ".json";
      xhr.open("GET", url, true);
      xhr.responseType = "json"
      xhr.send();
      xhr.onload = function () {
        if (xhr.response.status.code != 404) {
          if (xhr.response.player.teams == null) {
            divArray[i] = "noTeam";
          } else {
            tempArrayTeams = xhr.response.player.teams;
            for (var o = 0; o < tempArrayTeams.length; o++) {
              tempArrayTeamType = xhr.response.player.teams[o].type;
              if (tempArrayTeamType == "6on6") {
                //Done Till Here
                sixes = true
                console.log(xhr.response.player);
                console.log(Object.keys(xhr.response.player.teams[o].competitions));
              }
            }
            if (sixes == false) {
              divArray[i] = "noTeam";
            }
          }
        } else {
          divArray[i] = "noETF2L";
        }
      }
        xhr.onerror = function () {
        divArray[i] = "error"
      }
    }
}
