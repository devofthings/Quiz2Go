var score = 0;
var round = 0;
var timeleft = 0;
var locked = true;
var time2answer;
var rounds2play;
var savedStats = false;
var createdQuestionsArr = [];
var createdQuestions = 0;
var createdCorrect;
var dataBackup = data;
var question;
var isNewGame = false;

var timer_interval = null;

function uploadQuestions() {
    var file = document.getElementById('uploadFile').files[0];
    if (file) {
        if (file.name.endsWith(".json")) { //check if uploaded file is a .json file
            var reader = new FileReader();
            data = "";
            reader.onload = function (e) {
                data = JSON.parse(e.target.result); //parse json into data
                newGame(data.length);
            }
            reader.readAsText(file);
        }
        else {
            showError("Upload your downloaded questions or another valid .json file please.");
            exit();
        }
    } else newGame(dataBackup.length);
}

function showWarning(message) { //create custom warning alert
    var alert = document.getElementById("alertWarning");
    alert.style.display = "block";
    alert.innerHTML = "<center><strong>Warning!</strong> " + message + "</center";
    exit(); //break code to exit newGame()
}

function showError(message) { //create custom error alert
    var alert = document.getElementById("alertError");
    alert.style.display = "block";
    alert.innerHTML = "<center><strong>Error!</strong> " + message + "</center";
    exit(); //break code to exit newGame()
}

function newGame(maxRounds) {
    document.getElementById("alertWarning").style.display = "none";
    document.getElementById("alertError").style.display = "none";
    round = 0;
    score = 0;
    savedStats = false;
    isNewGame = true;
    getOptionValues();
    randomizeQuestions();
    createMatchfield();
    newRound();
}

function getOptionValues() { //Get values from the HTML form
    var options = document.getElementById("optionsForm");
    //check if form values are valid
    if ((options.elements[0].value === "" || options.elements[0].value <= 0) || (options.elements[1].value === "" || options.elements[1].value <= 0)) {
        showWarning("Please configure rounds to play & the time to answer with valid positive values > 0.");
        exit(); //break code to exit newGame()
    }
    if (options.elements[0].value > data.length) {
        options.elements[0].value = data.length;
        showWarning("You can play only one round per question. I set it to the maximum for you.");
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
        savedStats = false;
        timer();
        question = data[round].question;
        answerA.innerHTML = data[round].answerA;
        answerB.innerHTML = data[round].answerB;
        answerC.innerHTML = data[round].answerC;
        answerD.innerHTML = data[round].answerD;
        headline.innerHTML = "<center>" + question + "</center";
        subheadline.innerHTML = "<center>Score: " + score + " Round: " + (1 + round) + " / " + rounds2play + "</center>";
    }
    else gameOver(); 
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

function setButtons(question) {
    answerA.style.visibility = "hidden";
    answerB.style.visibility = "hidden";
    answerC.style.visibility = "hidden";
    answerD.style.visibility = "hidden";

    if (question.answerA === "") {
        showError("INVALID QUESTION!");
    }
    if (question.answerA !== "") {
        answerA.style.visibility = "visible";
    }
    if (question.answerB !== "") {
        answerB.style.visibility = "visible";
    }
    if (question.answerC !== "") {
        answerC.style.visibility = "visible";
    }
    if (question.answerD !== "") {
        answerD.style.visibility = "visible";
    }
}

function timer() {
    if (savedStats === false) {
        timeleft = 100 * time2answer;
    }
    var progressbar = document.getElementById("progressbar");
    timer_interval = setInterval(function () {
        progressbar.style.width = (1 / time2answer) * timeleft + "%";
        timeleft--;
        if (timeleft < 0) {
            clearInterval(timer_interval);
            round++;
            newRound();
        }
    }, 10);
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

function newGamePlus() {
    score = 0;
    round = 0;
    optionsForm.style.display = "initial";
    matchfield.style.display = "none";
    newGameBtn.parentNode.removeChild(newGameBtn);
}

function saveGame() {
    savedStats = true;
    document.getElementById("loadGameButton").className = "btn btn-outline-success btn-block";
    document.getElementById("optionsForm").style.display = "block";
    document.getElementById("matchfield").style.display = "none";
    document.getElementById("headline").innerHTML = "Editable Web Quiz";
    document.getElementById("subheadline").innerHTML = "Welcome to the Quiz! <br> Set your configurations below.";
    localStorage.setItem("score", score);
    localStorage.setItem("round", round + 1);
    localStorage.setItem("timeleft", timeleft);
    localStorage.setItem("locked", locked);
    localStorage.setItem("time2answer", time2answer);
    localStorage.setItem("rounds2play", rounds2play);
    clearInterval(timer_interval);
}

function loadGame() {
    if (loadGameButton.className === "btn btn-outline-success btn-block disabled") {
        return;
    }
    score = localStorage.score;
    round = localStorage.round - 1;
    timeleft = localStorage.timeleft;
    locked = localStorage.locked;
    time2answer = localStorage.time2answer;
    document.getElementById("loadGameButton").className = "btn btn-outline-success btn-block disabled";
    document.getElementById("optionsForm").style.display = "none";
    document.getElementById("matchfield").style.display = "block";
    document.getElementById("headline").innerHTML = "<center>" + question + "</center>";
    document.getElementById("subheadline").innerHTML = "<center>Score: " + score + " Round: " + (1 + round) + " / " + rounds2play + "</center>";
    timer();
}

function deleteGame() {
    savedStats = false;
    localStorage.removeItem("score");
    localStorage.removeItem("round");
    localStorage.removeItem("timeleft");
    localStorage.removeItem("locked");
    localStorage.removeItem("time2answer");
    localStorage.removeItem("round2play");
    document.getElementById("loadGameButton").className = "btn btn-outline-success btn-block disabled";

}

function createQuestions() { //open the question creation menu
    document.getElementById("createQuestions").style.display = "block";
    document.getElementById("optionsForm").style.display = "none";
}

function createNextQuestion() { //'hack' the link to look like abutton
    var options = document.getElementById("createQuestionsForm");
    if (options.elements[0].value !== "" && options.elements[1].value !== "" && createdCorrect !== undefined) {
        createdQuestionsArr[createdQuestions] = JSON.stringify({ "question": options.elements[0].value, "answerA": options.elements[1].value, "answerB": options.elements[2].value, "answerC": options.elements[3].value, "answerD": options.elements[4].value, "correct": createdCorrect });
        resetCreateQuestionForm();
        removeWarningAndError();
        createdQuestions++;
        enableDownloadButton();
    }
    else if (options.elements[0].value === "" || options.elements[0].value.startsWith(" ")) {
        showWarning("Please enter a question!");
    }
    else if (options.elements[1].value === "" || options.elements[0].value.startsWith(" ")) {
        showWarning("You need at least one answer. Start with 'Answer A'.");
    }
    else if (createdCorrect === undefined) {
        showWarning("You still need to select an correct answer.");
    }
    else {
        showError("Dafuq did you do? Please consider opening an issue on GitHub.");
    }
}

function setCorrectAnswer(selectedAnswer) {
    resetCorrectAnswer();
    document.getElementById(selectedAnswer).className = "form-control btn-success btn-block";
    createdCorrect = undefined;
    createdCorrect = document.getElementById(selectedAnswer);
    switch (selectedAnswer) {
        case ("createA"):
            createdCorrect = "answerA";
            break;
        case ("createB"):
            createdCorrect = "answerB";
            break;
        case ("createC"):
            createdCorrect = "answerC";
            break;
        case ("createD"):
            createdCorrect = "answerD";
            break;
        default:
            break;
    }
}

function resetCorrectAnswer() { //reset the button color if a new correct answer get selected
    document.getElementById("createA").className = "form-control btn-outline-info btn-block";
    document.getElementById("createB").className = "form-control btn-outline-info btn-block";
    document.getElementById("createC").className = "form-control btn-outline-info btn-block";
    document.getElementById("createD").className = "form-control btn-outline-info btn-block";
}

function resetCreateQuestionForm() {
    var options = document.getElementById("createQuestionsForm");
    for (var i = 0; i < 4; i++) {
        options.elements[i].value = "";
    }
    resetCorrectAnswer();
}

function resetCorrectAnswer(){//reset the button color if a new correct answer get selected
    document.getElementById("createA").className = "form-control btn-outline-info btn-block";
    document.getElementById("createB").className = "form-control btn-outline-info btn-block";
    document.getElementById("createC").className = "form-control btn-outline-info btn-block";
    document.getElementById("createD").className = "form-control btn-outline-info btn-block";
    createdCorrect = undefined;
}

function downloadQuestions() { // create a json file ut of created questions to download
    var a = document.getElementById("a");
    var file = new Blob(["[" + createdQuestionsArr + "]"], { "text": "json" });
    a.href = URL.createObjectURL(file);
    a.download = "question.json";
}

function goBack() { //close create questions menu on click
    document.getElementById("createQuestions").style.display = "none";
    document.getElementById("optionsForm").style.display = "block";
}

function removeWarningAndError(){
    var warning = document.getElementById("alertWarning");
    warning.style.display = "none";
    var error = document.getElementById("alertError");
    error.style.display = "none";
}

function enableDownloadButton(){
    if (createdQuestions >= 2) {
        document.getElementById("a").className = "btn btn-warning btn-block";
    }
}
