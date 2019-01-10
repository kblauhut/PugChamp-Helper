var requestCache = [];
var requestQueue = [];
var openRequests = [];

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if (msg.status == "request"){
      for (var i = 0; i < msg.idArray.length; i++) {
        returnData(msg.idArray[i], port);
      }
    }
  });
});

async function returnData(id, port) {
    let userURL = "http://api.etf2l.org/player/" + id;
    let resultURL = "http://api.etf2l.org/player/" + id + "/results/1?since=0";
    let cachedIDs = [];
    let idPos;

    for (var i = 0; i < requestCache.length; i++) {
      cachedIDs.push(requestCache[i].id);
    }
    idPos = cachedIDs.indexOf(id);

    if (idPos != -1) {
      port.postMessage({user: requestCache[idPos]});
    } else if (requestQueue.indexOf(id) != -1) {
      openRequests.push({id:id, port:port});
    } else if (requestQueue.indexOf(id) == -1) {
      requestQueue.push(id);
      let userJSON = await request(userURL);
      if (userJSON.status.code != 404 && userJSON.status.code != 500) {
        let resultJSON = await request(resultURL);
        let name = userJSON.player.name;
        let etf2lID = userJSON.player.id;
        let team = getTeam(resultJSON);
        let division = getDiv(resultJSON);
        userData = {id: id, data: {name: name, team: team, division: division, etf2lID: etf2lID}, registered: true}
      } else {
        userData = {id: id, registered: false};
      }
      requestQueue.splice(requestQueue.indexOf(id), 1);
      requestCache.push(userData);
      port.postMessage({user: userData});
      userDataUpdated(id, userData);
    }
}

function userDataUpdated(id, userData) {
  for (let i = 0; i < openRequests.length; i++) {
    if (openRequests[i].id == id) {
      let port = openRequests[i].port;
      port.postMessage({user: userData});
      openRequests.splice(i, 1);
      i--;
    }
  }
}

function request(url) {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
    xhr.onload = function() {
    resolve(xhr.response);
    }
  });
}

function getTeam(resultJSON) {
  let clan1;
  let clan2;
  let tier;
  let category;
  if (resultJSON.results != null) {
    for (let i = 0; i < resultJSON.results.length; i++) {
      clan1 = resultJSON.results[i].clan1;
      clan2 = resultJSON.results[i].clan2;
      category = resultJSON.results[i].competition.category;
      tier = resultJSON.results[i].division.tier;
      if (category == "6v6 Season" && tier != null) {
        if (clan1.was_in_team == 1) {
          return clan1.name;
        } else if (clan2.was_in_team == 1) {
          return clan2.name;
        }
      }
    }
  }
  return null;
}

function getDiv(resultJSON) {
  let tier;
  let category;
  let tierName;
  if (resultJSON.results != null) {
    for (let i = 0; i < resultJSON.results.length; i++) {
      tier = resultJSON.results[i].division.tier;
      tierName = resultJSON.results[i].division.name;
      competitionName = resultJSON.results[i].competition.name;
      category = resultJSON.results[i].competition.category;
      if (category.includes("6v6 Season") && tier != null) {
        if (tierName.includes("Division") && tier > 2) {
          return null;
        }
        if (tier == 2) {
          if (tierName.includes("Division 2")) return 2;
          return 3;
        }
        if (tier >= 3) return tier + 1;
        return tier;
      } else if (category.includes("6v6 Season") && competitionName.includes("Playoffs")) {
        if (competitionName.includes("Division 1")) {
          return 1;
        }
        if (competitionName.includes("Division 2")) {
          return 2;
        }
        if (competitionName.includes("Mid")) {
          return 3;
        }
        if (competitionName.includes("Low")) {
          return 4;
        }
        if (competitionName.includes("Open")) {
          return 5;
        }
      }
    }
  }
  return null;
}
