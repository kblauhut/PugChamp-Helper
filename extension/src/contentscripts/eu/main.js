var colors;
var elements;

chrome.storage.local.get(["colors", "elements"], function(result) {
  colors = result.colors;
  elements = result.elements;

  document.addEventListener("loaded", function(event) {
    updateAll();
    let tables = document.getElementsByClassName(elements.table);
    for (var i = 0; i < tables.length; i++) {
      addMutationObserver(tables[i])
    }
  });
});

function addMutationObserver(target) {
  let config = { attributes: true, childList: true, characterData: true };
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      console.log(mutation.target);
    });
  });
  observer.observe(target, config);
}


function updateAll() {

}
