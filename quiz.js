var score = 0;
var round = 0;
var timeleft = 0;
var locked = true;
var time2answer;
var rounds2play;

function newGame() {
    uploadQuestions();
    getOptionValues();
    randomizeQuestions();
    createMatchfield();
    newRound();
}

function newGamePlus() {
    score = 0;
    round = 0;
    optionsForm.style.display = "initial";
    matchfield.style.display = "none";
    newGameBtn.parentNode.removeChild(newGameBtn);
}

function getOptionValues() { //Get values from the HTML form
    var options = document.getElementById("optionsForm")
    if (options.elements[0].value > data.length) {
        alert("max. one round per question! I will fix it for you.");
        rounds2play = data.length;
    }
    else rounds2play = options.elements[0].value;
    time2answer = options.elements[1].value;
}

function randomizeQuestions() {
    data.sort(function () {
        return Math.random() - 0.5;
    });
}

function createMatchfield() {
    //remove Form
    optionsForm.style.display = "none";
    //remove headline text
    headline.innerHTML = "";
    //remove subheadline text
    subheadline.innerHTML = "";
    matchfield.style.display = "block";
}

function newRound() {
    if (round < rounds2play) {
        locked = false;
        resetButtons();
        setButtons(data[round]);
        timer();
        var question = data[round].question;
        answerA.innerHTML = data[round].answerA;
        answerB.innerHTML = data[round].answerB;
        answerC.innerHTML = data[round].answerC;
        answerD.innerHTML = data[round].answerD;
        headline.innerHTML = "<center>" + question + "</center";
        subheadline.innerHTML = "<center>Score: " + score + " Round: " + (round + 1) + " / " + rounds2play + "</center>";

    }
    else gameOver();
}

function gameOver() {
    headline.innerHTML = "<center> Game Over! </center";
    subheadline.innerHTML = "<center> You've scored " + score + " / " + rounds2play + " point(s). </center>";
    matchfield.style.display = "none";
    var newGameBtn = document.createElement("button");
    var t = document.createTextNode("New Game");
    newGameBtn.appendChild(t);
    document.getElementById("jumbo").appendChild(newGameBtn);
    newGameBtn.className = "btn btn-block btn-success"
    newGameBtn.id = "newGameBtn";
    newGameBtn.addEventListener("click", newGamePlus);

}

function timer() {
    timeleft = time2answer;
    var progressbar = document.getElementById("progressbar");
    var timer = setInterval(function () {
        progressbar.style.width = (100 / time2answer) * timeleft + "%";
        timeleft--;
        if (timeleft < 0) {
            clearInterval(timer);
            round++;
            newRound();
        }
    }, 1000);
}

function setButtons(question) {
    if (question.answerA != null && question.answerB != null && question.answerC != null && question.answerD != null) {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerC.style.visibility = "visible";
        answerD.style.visibility = "visible";
    }
    else if (question.answerB === null) {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "hidden";
        answerC.style.visibility = "hidden";
        answerD.style.visibility = "hidden";
    }
    else if (question.answerC === null) {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerD.style.visibility = "hidden";
        answerC.style.visibility = "hidden";
    }
    else if (question.answerD === null) {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerC.style.visibility = "visible";
        answerD.style.visibility = "hidden";
    }
    else {
        alert("INVALID QUESTION!");
    }
}

function clickButton(selectedAnswer) {
    if (locked === true) {
        return;
    }
    locked = true;
    if (selectedAnswer.getAttribute("id") === data[round].correct) {
        selectedAnswer.className = "btn btn-block btn-success";
        score++;
        timeleft = 1;
    }
    else {
        selectedAnswer.className = "btn btn-block btn-danger";
        var correctAnswer = document.getElementById(data[round].correct);
        correctAnswer.className = "btn btn-block btn-success";
        timeleft = 1;
    }
}

function resetButtons() {
    answerA.className = "btn btn-outline-primary btn-block";
    answerB.className = "btn btn-outline-primary btn-block";
    answerC.className = "btn btn-outline-primary btn-block";
    answerD.className = "btn btn-outline-primary btn-block";
}

function uploadQuestions() {
    var file = document.getElementById('uploadFile').files[0];
    if(file){
    var reader = new FileReader();
        reader.onload = function(e) { 
            var rawContent = e.target.result;
            data = JSON.parse(rawContent);
        }
    reader.readAsText(file);
    }
}

function saveGame(){
    localStorage.setItem("score", score);
    localStorage.setItem("round", round);
    localStorage.setItem("timeleft", timeleft);
    localStorage.setItem("locked", locked);
    localStorage.setItem("time2answer", time2answer);
    localStorage.setItem("round2play", rounds2play);
}

function loadGame(){
    score = localStorage.score;
    round = localStorage.round;
    timeleft = localStorage.timeleft;
    locked = localStorage.locked;
    time2answer = localStorage.time2answer;
    rounds2play = localStorage.rounds2play;
}

function deleteGame(){
    localStorage.removeItem("score");
    localStorage.removeItem("round");
    localStorage.removeItem("timeleft");
    localStorage.removeItem("locked");
    localStorage.removeItem("time2answer");
    localStorage.removeItem("round2play");
}

function createQuestions(){
    document.getElementById("createQuestions").style.display = "block";
    document.getElementById("optionsForm").style.display = "none";
}

function goBack(){
    document.getElementById("createQuestions").style.display = "none";
    document.getElementById("optionsForm").style.display = "block";
}