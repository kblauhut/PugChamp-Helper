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

    } else if (request.message == "update") {

    }

});





function idParse(playersAdded) {
    var htmlString;
    var idArray = [];
    var y = 0;
    var duplicate = false;

    for (var x = 0; x < playersAdded.length; x++) {
        htmlString = playersAdded[x].innerHTML;
        htmlString = htmlString.substring(htmlString.indexOf("/player/") + 8, htmlString.indexOf("/player/") + 25);
        if (x != 0) {
            for (var z = 0; z < idArray.length; z++) {

                if (idArray[z] == htmlString) {
                    duplicate = true;
                }
            }
        }
        if (duplicate != true) {
            idArray[y] = htmlString;
            y++;
        }
        duplicate = false;
    }
    return idArray;
}

function etf2lAPI(idArray) {
    var xhr = new XMLHttpRequest();
    var divArray = [];
    var arrayArray = [];

    for (var i = 0; i < idArray.length; i++) {
      xhr.open("GET", "http://api.etf2l.org/player/" + idArray[i] + ".json", true);
      xhr.send();
      divArray[i] = xhr.responseText;
    }
    console.log(divArray[2]);
}
