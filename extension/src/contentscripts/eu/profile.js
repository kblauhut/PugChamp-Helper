document.addEventListener("loaded", function(event) {
  let main = document.getElementById("mainContainer").children[0];
  let buttonOuterHTML = document.createElement("a");
  let buttonInnerHTML = main.getElementsByClassName("link x-scope paper-button-0")[1];
  buttonInnerHTML = buttonInnerHTML.cloneNode(true);
  main.appendChild(buttonOuterHTML);
  buttonOuterHTML.className = "button";
  buttonOuterHTML.setAttribute("href", getETF2LProfileUrl())
  buttonInnerHTML.innerText = "ETF2L Profile";
  buttonOuterHTML.appendChild(buttonInnerHTML);
  buttonOuterHTML.style.position = "absolute";
  buttonOuterHTML.style.left = 440+'px';
  buttonOuterHTML.style.top = 144+'px';
});

function getETF2LProfileUrl() {
  let etf2lURL = "http://etf2l.org/search/";
  let id = document.URL.substring(document.URL.length -17, document.URL.length);
  return etf2lURL + id;
}
