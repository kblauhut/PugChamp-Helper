chrome.runtime.onInstalled.addListener(function() {
  let colors = loadSettings("/res/data/colors.json");
  let elementquery = loadSettings("/res/data/elementquery.json");
  chrome.storage.local.set({colors: colors, elementquery: elementquery}, function() {
  });
});

function loadSettings(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.extension.getURL(url), false);
  xhr.send(null);
  if (xhr.status === 200) {
    return JSON.parse(xhr.responseText);
  }
}


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
    port.postMessage({user: userData});
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
    for (var i = 0; i < resultJSON.results.length; i++) {
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
    for (var i = 0; i < resultJSON.results.length; i++) {
      tier = resultJSON.results[i].division.tier;
      tierName = resultJSON.results[i].division.name;
      category = resultJSON.results[i].competition.category;
      if (category.includes("6v6 Season") && tier != null) {
        if (tier == 2) {
          if (tierName.includes("Division 2")) return 2;
          return 3;
        }
        if(tier >= 3) return tier + 1;
        return tier;
      } else if (tierName != null && category.includes("6v6 Season") && tierName.includes("Playoffs")) {
        if (tierName.includes("Division 1")) {
          return 1;
        }
        if (tierName.includes("Division 2")) {
          return 2;
        }
        if (tierName.includes("Mid")) {
          return 3;
        }
        if (tierName.includes("Low")) {
          return 4;
        }
        if (tierName.includes("Open")) {
          return 5;
        }
      }
    }
  }
  return null;
}
