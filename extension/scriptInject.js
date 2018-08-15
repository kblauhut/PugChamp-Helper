const colorPrem = "#FFEA32";
const colorD1 = "#EB4B4B";
const colorD2 = "#D32CE6";
const colorMid = "#8847FF";
const colorLow = "#4B69FF";
const colorOpen = "#5E98D9";
const colorNoDiv = "#B0C3D9";



document.addEventListener("loaded", function(event){
        colorScript();
});


function colorScript(){
    var playerAdded;
    playerAdded = document.getElementsByClassName("player  style-scope pugchamp-launchpad x-scope paper-icon-item-0");

    for (var i = 0; i < playerAdded.length; i++) {
        playerAdded[i].style.color = colorLow;
    }

    console.log(playerAdded);
    console.log(playerAdded.length);
};
