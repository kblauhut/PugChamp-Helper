document.addEventListener("loaded", function(event) {
    let playersAdded = document.getElementsByClassName("player  style-scope pugchamp-launchpad x-scope paper-icon-item-0");
    let idArray = findIds(playersAdded);
    let packagedArray = apiRequest(idArray);
});

function apiRequest(idList) {
    chrome.runtime.sendMessage({message: "request", idArray: idList}, function(response) {
 });
}

function findIds(playersAdded) {
    let idArray = [];

    for (var x = 0; x < playersAdded.length; x++) {
        let id = playersAdded[x].children[1].firstElementChild.getAttribute("href").substring(8);
        if (! idArray.includes(id)) {
            idArray.push(id);
        }
    }
    return idArray;
}

/*function colorScript(){
const colorPrem = "#FFEA32";
const colorD1 = "#EB4B4B";
const colorD2 = "#D32CE6";
const colorMid = "#8847FF";
const colorLow = "#4B69FF";
const colorOpen = "#5E98D9";
const colorNoDiv = "#B0C3D9";

    for (var x = 0; x < playersAdded.length; x++) {
        playersAdded[x].style.color = colorLow;
    }

    console.log(playersAdded);
    console.log(playersAdded.length);
}
*/
