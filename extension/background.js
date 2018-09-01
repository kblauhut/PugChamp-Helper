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
    var xhr = [];
    var divArray = [];
    var nameArray = [];
    var teamNameArray = [];
    var url = [];
    var tempArrayTeams = [];
    var tempArrayTeamType = [];
    var sixes = [];

    for (let i = 0; i < idArray.length; i++) {
        (function(i) {
            url[i] = "http://api.etf2l.org/player/" + idArray[i] + ".json";
            xhr[i] = new XMLHttpRequest();
            xhr[i].open("GET", url[i], true);
            xhr[i].responseType = "json"
            xhr[i].send();
            xhr[i].onload = function() {
                sixes[i] = false;
                if (xhr[i].response.status.code != 404) {
                    if (xhr[i].response.player.teams == null) {
                        divArray[i] = "noTeam";
                    } else {
                        tempArrayTeams[i] = xhr[i].response.player.teams;
                        for (let o = 0; o < tempArrayTeams[i].length; o++) {
                            tempArrayTeamType[i] = xhr[i].response.player.teams[o].type;
                            if (tempArrayTeamType[i] == "6on6") {
                                sixes[i] = true
                                if (xhr[i].response.player.teams[o].competitions != null) {
                                    let toIntArray = Object.keys(xhr[i].response.player.teams[o].competitions).map(Number);
                                    let maxInt = Math.max.apply(null, toIntArray);
                                    let tempDiv = xhr[i].response.player.teams[o].competitions[maxInt].division.name;
                                    if (tempDiv != null) {
                                        divArray[i] = tempDiv;
                                    } else {
                                        divArray[i] = "noSeason"
                                    }

                                } else {
                                    divArray[i] = "noMatches";
                                }
                            }
                        }
                        if (sixes[i] == false) {
                            divArray[i] = "noTeam";
                        }
                    }
                } else {
                    divArray[i] = "noETF2L";
                }
            }
            xhr[i].onerror = function() {
                divArray[i] = "error"
            }
        })(i);
    }
    console.log(divArray)
}
