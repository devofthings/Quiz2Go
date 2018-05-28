var score = 0;
var round = 0;
var timeleft = 0;
var locked = true;
var time2answer;
var rounds2play;

function newGame(){
    getOptionValues();
    newRound();
    console.log("New Game")
}

function getOptionValues(){ //Get the values from the HTML form
    var options = document.getElementById("optionsForm")
    rounds2play = options.elements[0].value;
    time2answer = options.elements[1].value;
    console.log(time2answer);
    console.log(rounds2play);
}

function newRound(){
    console.log("New Round");
    timer();
}

function timer(){
    timeleft = time2answer;
    var timer = setInterval(function() {
        console.log(timeleft);
        timeleft--;
        if(timeleft < 0) {
            clearInterval(timer);
            newRound();
        }
    }, 1000);
}

function setButtons(){

}

function resetButtons(){

}

function clickButton(selectedAnswer){
    
}