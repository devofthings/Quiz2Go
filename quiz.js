var score = 0;
var round = 0;
var timeleft = 0;
var locked = true;
var time2answer;
var rounds2play;

function newGame(){
    getOptionValues();
    createMatchfield();
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

function createMatchfield(){
    //remove Form
    var form = document.getElementById("optionsForm");
    form.parentNode.removeChild(form);
    //remove headline text
    var headline = document.getElementById("headline");
    headline.innerHTML = "";
    //remove subheadline text
    var subheadline = document.getElementById("subheadline");
    subheadline.innerHTML = "";
    
}

function newRound(){
    console.log("New Round");
    if(round < rounds2play){
        locked = false;
        round++;
        timer();
    }
    else{
    var subheadline = document.getElementById("subheadline");
    subheadline.innerHTML = "<center>Game Over!<br> You've scored "+ score + " / " + rounds2play + " point(s).</center>";
    }
}

function timer(){
    timeleft = time2answer;
    var progressbar = document.getElementById("progressbar");
    var timer = setInterval(function() {
        console.log(timeleft);
        progressbar.style.width = (100/time2answer)*timeleft + "%";
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
    if(locked === true){
        return;
    }
    locked = true;
    if(selectedAnswer.getAttribute("id") == correct){
        score++;
        timeleft = 0;
    }
    else{
        timeleft = 0;
    }
}