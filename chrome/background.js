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
