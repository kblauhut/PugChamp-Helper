var colors;
var elementquery;
requestCache = [];

chrome.storage.local.get(["colors", "elementquery"], function(result) {
  colors = result.colors;
  elementquery = result.elementquery;
  let draft = document.getElementsByClassName(elementquery.draft);
  let tables = document.getElementsByClassName(elementquery.tables);
  let allTables = document.getElementsByClassName(elementquery.allTables);

  document.addEventListener("loaded", function(event) {
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = chrome.extension.getURL("res/css/divTag.css");
    document.head.appendChild(style);

    if (draft[0].attributes.length < 2) {
        updateTable(draft[0]);
    }
    updateTable(allTables[0]);
    addMutationObserver(draft[0], "draft");
    for (let i = 0; i < tables.length; i++) {
      addMutationObserver(tables[i], "added")
    }
  });
});

function addMutationObserver(target, type) {
  let config = {childList: true, attributes: true};
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (type == "added") {
        addedMutation(mutation, target);
      } else {
        draftMutation(target);
      }
    });
  });
  observer.observe(target, config);

  function addedMutation(mutation, target) {
    if (mutation.removedNodes[0] != undefined && mutation.removedNodes[0].nodeName == "PAPER-ICON-ITEM") {
      updateTable(target);
    }
    if (mutation.addedNodes[1] != undefined && mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM") {
      updateTable(target);
    }
  }

  function draftMutation(target) {
    setTimeout(function() {
      if (target.attributes.length < 2) {
          updateTable(target);
        }
      }, 200);
    }
}

function updateTable(targetTable) {
  let elements = targetTable.getElementsByClassName(elementquery.playerElement);
  let draftElements = targetTable.getElementsByClassName(elementquery.draftPlayerElement);
  if (draftElements.length != 0) {
    elements = draftElements;
  }
  let idArray = getIds(elements);
  let elementID;
  let index;

  for (var i = 0; i < elements.length; i++) {
    elementID = elements[i].children[1].firstElementChild.getAttribute("href").substring(8);
    console.log(elementID);
    if (elementID != null && elementID != undefined) {
      index = requestCache.findIndex(cache=> cache.id === elementID)
      if (index != -1 && requestCache[index].registered) {
        updateUser(elements[i], requestCache[index].data.division, requestCache[index].data.etf2lID)
      }
    }
  }

  let port = chrome.runtime.connect({name: "main"});
  port.postMessage({status: "request", idArray: idArray});
  port.onMessage.addListener(function(msg) {
    requestCache.push(msg.user);
    for (let i = 0; i < elements.length; i++) {
      elementID = elements[i].children[1].firstElementChild.getAttribute("href").substring(8);
      if (elementID != null && elementID != undefined) {
        if (msg.user.id == elementID && msg.user.registered) {
          updateUser(elements[i], msg.user.data.division, msg.user.data.etf2lID)
        }
      }
    }
  });
}

function updateUser(targetElement, div, id) {
  let href = "http://etf2l.org/forum/user/" + id;
  let tag = targetElement.getElementsByClassName("etf2lDivTag")[0];
  if (tag == null) {
    tag = document.createElement("a");
    tag.className = "etf2lDivTag";
    tag.setAttribute("href", href);
    targetElement.firstElementChild.appendChild(tag);
    tag.style.color = "black";
  }

  switch(div) {
  case 0:
      tag.style.background = colors.default.prem;
      tag.innerText = "PREM"
      break;
  case 1:
      tag.style.background = colors.default.div1;
      tag.innerText = "DIV1"
      break;
  case 2:
      tag.style.background = colors.default.div2;
      tag.innerText = "DIV2"
      break;
  case 3:
      tag.style.background = colors.default.mid;
      tag.innerText = "MID"
      break;
  case 4:
      tag.style.background = colors.default.low;
      tag.innerText = "LOW"
      break;
  case 5:
      tag.style.background = colors.default.open;
      tag.innerText = "OPEN"
      break;
  case null:
      tag.style.background = colors.default.null;
      tag.innerText = "NERD"
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
            console.log(id);
        }
    }
    return idArray;
}
