const colorPrem = "#FFEA32";
const colorD1 = "#EB4B4B";
const colorD2 = "#D32CE6";
const colorMid = "#8847FF";
const colorLow = "#4B69FF";
const colorOpen = "#5E98D9";
const colorNoDiv = "#B0C3D9";



document.addEventListener("loaded", function(event) {
    var playersAdded = document.getElementsByClassName("player  style-scope pugchamp-launchpad x-scope paper-icon-item-0");
    var idArray;
    requestData();
});

function requestData() {
    chrome.runtime.sendMessage({message: "request"}, function(response) {
    console.log(response);
 });
}

function requestUpdatedData() {

}

/*function colorScript(){
    for (var x = 0; x < playerAdded.length; x++) {
        playerAdded[x].style.color = colorLow;
    }

    console.log(playerAdded);
    console.log(playerAdded.length);
}
*/
