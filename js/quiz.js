var score = 0;
var round = 0;
var timeleft = 0;
var locked = true;
var time2answer;
var rounds2play;
var loadedStats = false;
var createdQuestionsArr = [];
var createdQuestions = 0;
var createdCorrect;

function uploadQuestions() {
    var file = document.getElementById('uploadFile').files[0];
    if (file) {
        if(file.name.endsWith(".json")){ //check if uploaded file is a .json file
            var reader = new FileReader();
            data = "";
            reader.onload = function (e) {
                var rawContent = e.target.result;
                data = JSON.parse(rawContent);
            }
            reader.readAsText(file);
            newGame();
        }
        else{
            showError("Upload your downloaded questions or another valid .json file please.");
            return;
        }
    }
    newGame();
}

function showWarning(message){ //create custom warning alert
    var alert = document.getElementById("alertWarning");
    alert.style.display = "block";
    alert.innerHTML = "<strong>Warning!</strong> " + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'> <span aria-hidden='true'>&times;</span> </button>";
    exit(); //break code to exit newGame()
}

function showError(message){ //create custom error alert
    var alert = document.getElementById("alertError");
    alert.style.display = "block";
    alert.innerHTML = "<strong>Error!</strong> " + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'> <span aria-hidden='true'>&times;</span> </button>";
    exit(); //break code to exit newGame()
}

function newGame() {
    document.getElementById("alertWarning").style.display = "none";
    document.getElementById("alertError").style.display = "none";
    var options = document.getElementById("optionsForm");
    //check if form values are valid
    if ((options.elements[0].value === "" || options.elements[0].value <= 0) ||(options.elements[1].value === "" || options.elements[1].value <= 0)){
        showWarning("Please configure rounds to play & the time to answer with valid positive values > 0.");
        return;
    }
    getOptionValues();
    randomizeQuestions();
    createMatchfield();
    newRound();
}

function getOptionValues() { //Get values from the HTML form
    var options = document.getElementById("optionsForm");
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
    console.log(round);
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
    if (question.answerA !== "" && question.answerB !== "" && question.answerC !== "" && question.answerD !== "") {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerC.style.visibility = "visible";
        answerD.style.visibility = "visible";
    }
    else if (question.answerB === "") {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "hidden";
        answerC.style.visibility = "hidden";
        answerD.style.visibility = "hidden";
    }
    else if (question.answerC === "") {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerD.style.visibility = "hidden";
        answerC.style.visibility = "hidden";
    }
    else if (question.answerD === "") {
        answerA.style.visibility = "visible";
        answerB.style.visibility = "visible";
        answerC.style.visibility = "visible";
        answerD.style.visibility = "hidden";
    }
    else {
        showError("INVALID QUESTION!");
    }
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
    localStorage.setItem("score", score);
    localStorage.setItem("round", round + 1);
    localStorage.setItem("timeleft", timeleft);
    localStorage.setItem("locked", locked);
    localStorage.setItem("time2answer", time2answer);
    localStorage.setItem("round2play", rounds2play);
}

function loadGame() {
    loadedStats = true;
    score = localStorage.score;
    round = localStorage.round - 1;
    timeleft = localStorage.timeleft;
    locked = localStorage.locked;
    time2answer = localStorage.time2answer;
    rounds2play = localStorage.rounds2play;
}

function deleteGame() {
    localStorage.removeItem("score");
    localStorage.removeItem("round");
    localStorage.removeItem("timeleft");
    localStorage.removeItem("locked");
    localStorage.removeItem("time2answer");
    localStorage.removeItem("round2play");
}

function createQuestions() { //open the question creation menu
    document.getElementById("createQuestions").style.display = "block";
    document.getElementById("optionsForm").style.display = "none";
}

function createNextQuestion() { //'hack' the link to look like abutton
    if (createdQuestions >= 0) {
        document.getElementById("a").className = "btn btn-warning btn-block";
    }

    var options = document.getElementById("createQuestionsForm");
    if (options.elements[0].value !== "" && options.elements[1].value !== "" && createdCorrect !== undefined) {
        createdQuestionsArr[createdQuestions] = JSON.stringify({ "question": options.elements[0].value, "answerA": options.elements[1].value, "answerB": options.elements[2].value, "answerC": options.elements[3].value, "answerD": options.elements[4].value, "correct": createdCorrect });
        createdQuestions++;
        resetCreateQuestionForm();
    }
    else if (options.elements[0].value === "") {
        showWarning("Please enter a question!");
    }
    else if (options.elements[1].value === "") {
        showWarning("You need at least one answer. Start with 'Answer A'.");
    }
    else if(createdCorrect === undefined) {
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

function resetCorrectAnswer(){//reset the button color if a new correct answer get selected
    document.getElementById("createA").className = "form-control btn-outline-info btn-block";
    document.getElementById("createB").className = "form-control btn-outline-info btn-block";
    document.getElementById("createC").className = "form-control btn-outline-info btn-block";
    document.getElementById("createD").className = "form-control btn-outline-info btn-block";
}

function resetCreateQuestionForm() {
    var options = document.getElementById("createQuestionsForm");
    options.elements[0].value = "";
    options.elements[1].value = "";
    options.elements[2].value = "";
    options.elements[3].value = "";
    options.elements[4].value = "";
    options.elements[0].value = "";
    document.getElementById("createA").className = "form-control btn-outline-info btn-block";
    document.getElementById("createB").className = "form-control btn-outline-info btn-block";
    document.getElementById("createC").className = "form-control btn-outline-info btn-block";
    document.getElementById("createD").className = "form-control btn-outline-info btn-block";
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