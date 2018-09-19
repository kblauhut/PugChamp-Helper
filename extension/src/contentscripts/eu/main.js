var colors;
var elements;

chrome.storage.local.get(["colors", "elements"], function(result) {
  colors = result.colors;
  elements = result.elements;

  document.addEventListener("loaded", function(event) {
    updateAll();
    let tables = document.getElementsByClassName(elements.table);
    for (var i = 0; i < tables.length; i++) {
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
      }
      if (mutation.addedNodes[1] != undefined && mutation.addedNodes[1].nodeName == "PAPER-ICON-ITEM") {
        console.log("player added @" + debugIndex);
      }
    });
  });
  observer.observe(target, config);
}


function updateAll() {

}
