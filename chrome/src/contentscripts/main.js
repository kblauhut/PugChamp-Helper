let colors;
let querystrings;
let settings;
let region = document.URL.substring(
  document.URL.indexOf("/") + 2,
  document.URL.indexOf("/") + 4
);

chrome.storage.sync.get(["colors", "querystrings", "settings"], function (
  result
) {
  colors = result.colors;
  settings = result.settings;
  querystrings = result.querystrings;
  let draftTables = document.getElementsByClassName(querystrings.draftTables);
  let queueTables = document.getElementsByClassName(querystrings.queueTables);
  let queue = document.getElementsByClassName(querystrings.queue);
  if (settings.divTags || settings.nameSubstitution)
    document.addEventListener("loaded", function (event) {
      let style = document.createElement("link");
      style.rel = "stylesheet";
      style.type = "text/css";
      style.href = chrome.extension.getURL("res/css/divTag.css");
      document.head.appendChild(style);

      for (let i = 0; i < queueTables.length; i++) {
        updateTable(
          queueTables[i].getElementsByClassName(querystrings.queuePlayerElement)
        );
        addMutationObserver(queueTables[i], "queue");
      }
      for (let j = 0; j < draftTables.length; j++) {
        updateTable(
          draftTables[j].getElementsByClassName(querystrings.draftPlayerElement)
        );
        addMutationObserver(draftTables[j], "draft");
      }
    });
});

function addMutationObserver(target, type) {
  let config = { childList: true, attributes: true, subtree: true };
  if (type == "draft")
    config = { childList: true, attributes: true, subtree: true };

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (type == "queue") {
        queueMutation(mutation, target);
      } else {
        draftMutation(mutation, target);
      }
    });
  });
  observer.observe(target, config);

  function queueMutation(mutation, target) {
    if (
      mutation.removedNodes[0] != undefined &&
      mutation.removedNodes[0].nodeName == "PAPER-ICON-ITEM"
    ) {
      updateTable(
        target.getElementsByClassName(querystrings.queuePlayerElement)
      );
    }
    if (
      mutation.addedNodes[1] != undefined &&
      mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM"
    ) {
      updateTable([mutation.addedNodes[1]]);
    }
  }

  function draftMutation(mutation, target) {
    if (
      mutation.addedNodes[1] != undefined &&
      mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM"
    ) {
      updateTable([mutation.addedNodes[1]]);
    }
    if (
      mutation.type == "childList" &&
      mutation.target.className == querystrings.button
    ) {
      updateTable([mutation.target.parentNode]);
    }
  }
}

function updateTable(elements) {
  let idArray = getIds(elements);
  let port = chrome.runtime.connect({ name: region });
  port.postMessage({ idArray: idArray });
  port.onMessage.addListener(function (msg) {
    for (let i = 0; i < elements.length; i++) {
      elementID = elements[i].children[1].firstElementChild
        .getAttribute("href")
        .substring(8);
      if (elementID != null && elementID != undefined) {
        if (msg.user.id == elementID) {
          if (msg.user.registered) {
            updateUser(
              elements[i],
              msg.user.data.division,
              msg.user.data.etf2lID,
              msg.user.data.name
            );
          } else {
            updateUser(elements[i], null, null);
          }
        }
      }
    }
  });
}

function updateUser(targetElement, div, id, name) {
  if (settings.nameSubstitution) {
    if (name != null && name != undefined) targetElement.getElementsByClassName("flex style-scope pugchamp-launchpad")[0].firstElementChild.innerText = name;
  }
  if (!settings.divTags) return;

  let tag = targetElement.getElementsByClassName("etf2lDivTag")[0];
  let href = null;
  if (id != null) href = "http://etf2l.org/forum/user/" + id;
  if (tag == null) {
    tag = document.createElement("a");
    tag.className = "etf2lDivTag";
    if (href != null) {
      tag.setAttribute("href", href);
      tag.setAttribute("target", "_blank");
    }
    targetElement.firstElementChild.appendChild(tag);
    tag.style.color = "black";
  } else {
    tag.removeAttribute("href");
    if (href != null) {
      tag.setAttribute("href", href);
    }
  }

  switch (div) {
    case "etf2l_prem":
      tag.style.background = colors.prem;
      tag.innerText = "PREM";
      break;
    case "etf2l_div1":
      tag.style.background = colors.div1;
      tag.innerText = "DIV1";
      break;
    case "etf2l_div2":
      tag.style.background = colors.div2;
      tag.innerText = "DIV2";
      break;
    case "etf2l_div3":
      tag.style.background = colors.div3;
      tag.innerText = "DIV3";
      break;
    case "etf2l_mid":
      tag.style.background = colors.mid;
      tag.innerText = "MID";
      break;
    case "etf2l_low":
      tag.style.background = colors.low;
      tag.innerText = "LOW";
      break;
    case "etf2l_open":
      tag.style.background = colors.open;
      tag.innerText = "OPEN";
      break;
    case "rgl_inv":
      tag.style.background = colors.prem;
      tag.innerText = "RGL-I";
      break;
    case "rgl_adv":
      tag.style.background = colors.div1;
      tag.innerText = "RGL-A";
      break;
    case "rgl_main":
      tag.style.background = colors.div2;
      tag.innerText = "RGL-M";
      break;
    case "rgl_im":
      tag.style.background = colors.mid;
      tag.innerText = "RGL-IM";
      break;
    case "rgl_open":
      tag.style.background = colors.low;
      tag.innerText = "RGL-O";
      break;
    case "rgl_new":
      tag.style.background = colors.open;
      tag.innerText = "RGL-N";
      break;
    case "esea_inv":
      tag.style.background = colors.prem;
      tag.innerText = "ESEA-I";
      break;
    case "esea_im":
      tag.style.background = colors.div1;
      tag.innerText = "ESEA-IM";
      break;
    case "esea_open":
      tag.style.background = colors.div2;
      tag.innerText = "ESEA-O";
      break;
    default:
      tag.style.background = colors.null;
      tag.innerText = "NEW";
  }

  if (id == "124593") {
    tag.style.background = "linear-gradient(90deg, rgba(205,203,238,1) 0%, rgba(255,44,225,1) 47%, rgba(188,244,255,1) 100%)"
    tag.innerText = "FREAK";
  }
  if (id == "119165") {
    tag.style.background = "linear-gradient(126deg, rgba(191,63,162,1) 0%, rgba(244,178,248,1) 22%, rgba(255,255,255,1) 43%, rgba(192,120,255,1) 72%, rgba(168,231,232,1) 100%)"
    tag.className += " animated"
  }
}
function getIds(targetTable) {
  let idArray = [];
  for (let i = 0; i < targetTable.length; i++) {
    let id = targetTable[i].children[1].firstElementChild
      .getAttribute("href")
      .substring(8);
    if (!idArray.includes(id)) {
      idArray.push(id);
    }
  }
  return idArray;
}
