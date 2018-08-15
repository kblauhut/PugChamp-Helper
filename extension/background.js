chrome.runtime.onInstalled.addListener(function() {
  console.log("onInstalled function called.");
  // TODO: Download player data from server.
  
  chrome.storage.sync.set({colorCoding: true, nameSubstitution: true}, function() {
      console.log("variables 'colorCoding' and nameSubstitution set to true. Should be accessible from anywhere in the extension now.");
    });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'eu.pug.champ.gg'}})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
