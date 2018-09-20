var colors;
var elementquery;
requestCache = [];

chrome.storage.local.get(["colors", "elementquery"], function(result) {
  colors = result.colors;
  elementquery = result.elementquery;
  let tables = document.getElementsByClassName(elementquery.table);
  let allTables = document.getElementsByClassName(elementquery.allTables);

  document.addEventListener("loaded", function(event) {
    updateTable(allTables[0]);
    for (let i = 0; i < tables.length; i++) {
      addMutationObserver(tables[i], i)
    }
  });
});

function addMutationObserver(target, debugIndex) {
  let config = {childList: true};
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.removedNodes[0] != undefined && mutation.removedNodes[0].nodeName == "PAPER-ICON-ITEM") {
        console.log("player removed @" + debugIndex);
        updateTable(target);
      }
      if (mutation.addedNodes[1] != undefined && mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM") {
        console.log("player added @" + debugIndex);
        updateTable(target);
      }
    });
  });
  observer.observe(target, config);
}


function updateTable(targetTable) {
  let elements = targetTable.getElementsByClassName(elementquery.playerElement);
  let idArray = getIds(elements);
  let elementID;
  let index;

  for (var i = 0; i < elements.length; i++) {
    elementID = elements[i].children[1].firstElementChild.getAttribute("href").substring(8);
    index = requestCache.findIndex(cache=> cache.id === elementID)
    if (index != -1 && requestCache[index].registered) {
      updateUser(elements[i], requestCache[index].data.division)
    }
  }

  let port = chrome.runtime.connect({name: "main"});
  port.postMessage({status: "request", idArray: idArray});
  port.onMessage.addListener(function(msg) {
    requestCache.push(msg.user);
    for (let i = 0; i < elements.length; i++) {
      elementID = elements[i].children[1].firstElementChild.getAttribute("href").substring(8);
      if (msg.user.id == elementID && msg.user.registered) {
        updateUser(elements[i], msg.user.data.division)
      }
    }
  });
}

function updateUser(targetElement, div) {
  switch(div) {
  case 0:
      targetElement.style.color = colors.default.prem;
      targetElement.setAttribute("division", "0");
      break;
  case 1:
      targetElement.style.color = colors.default.div1;
      targetElement.setAttribute("division", "1");
      break;
  case 2:
      targetElement.style.color = colors.default.div2;
      targetElement.setAttribute("division", "2");
      break;
  case 3:
      targetElement.style.color = colors.default.mid;
      targetElement.setAttribute("division", "3");
      break;
  case 4:
      targetElement.style.color = colors.default.low;
      targetElement.setAttribute("division", "4");
      break;
  case 5:
      targetElement.style.color = colors.default.open;
      targetElement.setAttribute("division", "5");
      break;
  case null:
      targetElement.style.color = colors.default.null;
      targetElement.setAttribute("division", "null");
      break;
    }
}

function sortTable(targetTable) {
  // TODO: Sort table by division.
}

function getIds(targetTable) {
    let idArray = [];
    let cachedIDs = [];
    let id;

    for (var i = 0; i < requestCache.length; i++) {
      cachedIDs.push(requestCache[i].id);
    }

    for (let i = 0; i < targetTable.length; i++) {
      id = targetTable[i].children[1].firstElementChild.getAttribute("href").substring(8);
        if (! cachedIDs.includes(id) && ! idArray.includes(id)) {
            idArray.push(id);
        }
    }
    return idArray;
}
