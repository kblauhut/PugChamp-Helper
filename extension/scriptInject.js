const colorPrem = "#FFEA32";
const colorD1 = "#EB4B4B";
const colorD2 = "#D32CE6";
const colorMid = "#8847FF";
const colorLow = "#4B69FF";
const colorOpen = "#5E98D9";
const colorNoDiv = "#B0C3D9";



document.addEventListener("loaded", function(event) {
    var idArray = idParse();
    etf2lAPI(idArray);
});

function idParse() {
    var playerAdded;
    var htmlString;
    var idArray = [];
    var y = 0;
    var duplicate = false;
    playersAdded = document.getElementsByClassName("player  style-scope pugchamp-launchpad x-scope paper-icon-item-0");

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

function etf2lAPI(idArray) {
    var xhr = new XMLHttpRequest();
    var divArray = [];
    var arrayArray = [];

    for (var i = 0; i < idArray.length; i++) {
      xhr.open("GET", "http://api.etf2l.org/player/" + idArray[i] + ".json", true);
      xhr.send();
      divArray[i] = xhr.responseText;
    }
    console.log(divArray[2]);
}

/*function colorScript(){
    for (var x = 0; x < playerAdded.length; x++) {
        playerAdded[x].style.color = colorLow;
    }

    console.log(playerAdded);
    console.log(playerAdded.length);
}
*/
