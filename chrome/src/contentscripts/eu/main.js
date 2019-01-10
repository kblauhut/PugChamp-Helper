var colors;
var elementquery;

chrome.storage.local.get(["colors", "elementquery"], function(result) {
  colors = result.colors;
  elementquery = result.elementquery;
  let draftTables = document.getElementsByClassName(elementquery.draftTables);
  let queueTables = document.getElementsByClassName(elementquery.queueTables);
  let queue = document.getElementsByClassName(elementquery.queue);

  document.addEventListener("loaded", function(event) {
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = chrome.extension.getURL("res/css/divTag.css");
    document.head.appendChild(style);

    for (let i = 0; i < queueTables.length; i++) {
      updateTable(queueTables[i].getElementsByClassName(elementquery.queuePlayerElement));
      addMutationObserver(queueTables[i], "queue")
    }
    for (let j = 0; j < draftTables.length; j++) {
      updateTable(draftTables[j].getElementsByClassName(elementquery.draftPlayerElement));
      addMutationObserver(draftTables[j], "draft")
    }
  });
});

function addMutationObserver(target, type) {
  let config = {childList: true, attributes: true, subtree:true};
  if (type == "draft") config = {childList: true, attributes: true, subtree: true};

  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (type == "queue") {
        queueMutation(mutation, target);
      } else {
        draftMutation(mutation, target);
      }
    });
  });
  observer.observe(target, config);

  function queueMutation(mutation, target) {
    if (mutation.removedNodes[0] != undefined && mutation.removedNodes[0].nodeName == "PAPER-ICON-ITEM") {
      updateTable(target.getElementsByClassName(elementquery.queuePlayerElement));
    }
    if (mutation.addedNodes[1] != undefined && mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM") {
      updateTable([mutation.addedNodes[1]]);
    }
  }

  function draftMutation(mutation, target) {
    if (mutation.addedNodes[1] != undefined && mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM") {
      updateTable([mutation.addedNodes[1]]);
    }
    if (mutation.type == "childList" && mutation.target.className == elementquery.button) {
        updateTable([mutation.target.parentNode.parentNode]);
    }
  }
}

function updateTable(elements) {
  let idArray = getIds(elements);
  let port = chrome.runtime.connect({name: "main"});
  port.postMessage({status: "request", idArray: idArray});
  port.onMessage.addListener(function(msg) {
    for (let i = 0; i < elements.length; i++) {
      elementID = elements[i].children[1].firstElementChild.getAttribute("href").substring(8);
      if (elementID != null && elementID != undefined) {
        if (msg.user.id == elementID) {
          if (msg.user.registered) {
            updateUser(elements[i], msg.user.data.division, msg.user.data.etf2lID)
          } else {
            updateUser(elements[i], null, null)
          }
        }
      }
    }
  });
}

function updateUser(targetElement, div, id) {
  let tag = targetElement.getElementsByClassName("etf2lDivTag")[0];
  let href = null;
  if (id != null) href = "http://etf2l.org/forum/user/" + id;
  if (tag == null) {
    tag = document.createElement("a");
    tag.className = "etf2lDivTag";
    if (href != null) {
      tag.setAttribute("href", href);
    }
    targetElement.firstElementChild.appendChild(tag);
    tag.style.color = "black";
  } else {
    tag.removeAttribute("href");
    if (href != null) {
      tag.setAttribute("href", href);
    }
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

function getIds(targetTable) {
    let idArray = [];
    for (let i = 0; i < targetTable.length; i++) {
      let id = targetTable[i].children[1].firstElementChild.getAttribute("href").substring(8);
        if (! idArray.includes(id)) {
            idArray.push(id);
        }
    }
    return idArray;
}
