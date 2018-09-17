document.addEventListener("loaded", function(event) {
    let playersAdded = document.getElementsByClassName("player style-scope pugchamp-launchpad x-scope paper-icon-item-0");
    let idArray = findIds(playersAdded);
    apiRequest(idArray, playersAdded);
});

function apiRequest(idArray, playersAdded) {
  let port = chrome.runtime.connect({name: "main"});
  port.postMessage({status: "request", idArray: idArray});
  port.onMessage.addListener(function(msg) {
    updateDom(msg.user, playersAdded)
  });
}

function findIds(playersAdded) {
    let idArray = [];

    for (var i = 0; i < playersAdded.length; i++) {
        let id = playersAdded[i].children[1].firstElementChild.getAttribute("href").substring(8);
        if (! idArray.includes(id)) {
            idArray.push(id);
        }
    }
    return idArray;
}

function updateDom(userData, playersAdded) {
  const colorPrem = "#EB4B4B";
  const colorD1 = "#D32CE6";
  const colorD2 = "#8847FF";
  const colorMid = "#4B69FF";
  const colorLow = "#5E98D9";
  const colorOpen = "#B0C3D9";
  let id;

  for (var i = 0; i < playersAdded.length; i++) {
    id = playersAdded[i].children[1].firstElementChild.getAttribute("href").substring(8);
    if (userData.id == id && userData.registered) {
      updateColor(userData.data.division, playersAdded[i])
    }
  }

  function updateColor(div, element) {
    switch(div) {
    case 0:
        element.style.color = colorPrem;
        break;
    case 1:
        element.style.color = colorD1;
        break;
    case 2:
        element.style.color = colorD2;
        break;
    case 3:
        element.style.color = colorMid;
        break;
    case 4:
        element.style.color = colorLow;
        break;
    case 5:
        element.style.color = colorOpen;
        break;
      }
  }
}
