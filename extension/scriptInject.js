document.addEventListener("loaded", function(event) {
    var playersAdded = document.getElementsByClassName("player  style-scope pugchamp-launchpad x-scope paper-icon-item-0");
    var idArray = idParse(playersAdded);
    var packagedArray = apiRequest(idArray);
});

function apiRequest(idArray) {
    chrome.runtime.sendMessage({message: "request", idArray: idArray}, function(response) {
 });
}

function idParse(playersAdded) {
    var htmlString;
    var idArray = [];
    var y = 0;
    var duplicate = false;

    for (var x = 0; x < playersAdded.length; x++) {
        htmlString = playersAdded[x].innerHTML;
        htmlString = htmlString.substring(htmlString.indexOf("/player/") + 8, htmlString.indexOf("/player/") + 25);
        if (x != 0) {
            for (var z = 0; z < idArray.length; z++) {

                if (idArray[z] == htmlString) {
                    duplicate = true;
                }
            }
        }
        if (duplicate != true) {
            idArray[y] = htmlString;
            y++;
        }
        duplicate = false;
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
