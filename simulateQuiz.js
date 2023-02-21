
class simulateQuiz {

    static UNANSWERED = 0;
    static WRITE = 1;
    static WRONG = -0.25;
    static COUINTERTIMEOT = 60 * 60;
    static questions = new Object();
    static pageBlocks = [];
    static timeout = 0;
    static timer = 0;
	

    static checkTimer() {
        var counterDiv = document.getElementById("couter");
		if (counterDiv==null)
		{
			window.clearTimeout(simulateQuiz.timer);
			return ;
		}
        counterDiv.innerHTML = Math.floor(simulateQuiz.timeout / 60) + ":" + (simulateQuiz.timeout % 60) + " sec";
        simulateQuiz.timeout--;
        if (simulateQuiz.timeout < 0) {
            simulateQuiz.checkQuestions();

        }
    }
    static showPage() {
        for (var page of simulateQuiz.pageBlocks) {
            page.style.display = "none";
        }
        var currentPage = document.getElementById("Page" + this.value);
        currentPage.style.display = "block";
    }

    static checkQuestions() {
        var answers = Array();
        window.clearTimeout(simulateQuiz.timer);
        for (var questionIndex in simulateQuiz.questions) {
            var elements = document.getElementsByName("n" + questionIndex);
            answers[questionIndex] = simulateQuiz.UNANSWERED;
            var noteDiv = document.getElementById("note" + simulateQuiz.questions[questionIndex].index);

            for (var i = 0; i < elements.length; i++) {

                if (elements[i].checked) {

                    if (simulateQuiz.questions[questionIndex].correctIndex == i + 1) {
                        answers[questionIndex] = simulateQuiz.WRITE;
                    } else {
                        answers[questionIndex] = simulateQuiz.WRONG;
                    }

                }
            }
            if (answers[questionIndex] != simulateQuiz.WRITE) {
                noteDiv.innerHTML = "Resposta certa " + simulateQuiz.questions[questionIndex].correctIndex;
				noteDiv.style.background = "red";
				
            }

        }
        var total = 0;
        for (var answer of answers) {
            total += answer;

        }
        var counterDiv = document.getElementById("couter");
        counterDiv.innerHTML = "Pontos:" + total + " em 40  a classificação mínima de 20 pontos";
    }

    constructor(json) {

        var numberOfUnaswered = 0;
        var questionCounter = 0;
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange = function () {

            if (ajaxRequest.readyState == 4) {
                //the request is completed, now check its status
                if (ajaxRequest.status == 200) {
                    //turn JSON into array

                    var allMessagesArray = JSON.parse(ajaxRequest.responseText);
					allMessagesArray=allMessagesArray.questions;
                    var randomQ = [];
                    for (let i = 0; i < 40; i++) {
                        var questionIndex = Math.floor(Math.random() * allMessagesArray.length);
                        randomQ.push(allMessagesArray[questionIndex]);
                        allMessagesArray.splice(questionIndex, 1);
                    }
					simulateQuiz.questions=randomQ;
                    var welcomeDiv = document.getElementById("welcome");
                    welcomeDiv.innerHTML = "";
                    var indexBlock = document.createElement("div");
                    indexBlock.id = "qIndex";

                    welcomeDiv.appendChild(indexBlock);
                    var index = 0;
                    for (var qindex in randomQ) {
                        var pageBlock;
                        randomQ[qindex].index = index;
                        index++;
                        if (questionCounter == 0) {
                            pageBlock = document.createElement("div");
                            pageBlock.id = "Page" + questionCounter;
                            pageBlock.style.display = "block";
                            let btn = document.createElement("button");
                            btn.innerHTML = questionCounter;
                            btn.value = questionCounter;
                            btn.onclick = simulateQuiz.showPage;
                            indexBlock.appendChild(btn);
                            simulateQuiz.pageBlocks.push(pageBlock);

                        } else if (questionCounter % 10 == 0) {
                            pageBlock = document.createElement("div");
                            pageBlock.id = "Page" + questionCounter;
                            pageBlock.style.display = "none";
                            let btn = document.createElement("button");
                            btn.innerHTML = questionCounter;
                            btn.value = questionCounter;
                            btn.onclick = simulateQuiz.showPage;
                            indexBlock.appendChild(btn);
                            simulateQuiz.pageBlocks.push(pageBlock);
                        }
                        questionCounter++;
                        var questionBlock = document.createElement("div");
                        var questiontxt = document.createElement("div");
						questiontxt.className = "question";
                        var noteBlock = document.createElement("div");
                        noteBlock.id = "note" + simulateQuiz.questions[qindex].index;
                        questiontxt.innerHTML = simulateQuiz.questions[qindex].index+1 + ")" + simulateQuiz.questions[qindex].question

                        questionBlock.appendChild(questiontxt);
                        let i = 1;
                        for (let key of simulateQuiz.questions[qindex].answers) {

                            let label = document.createElement("label");
                            let span = document.createElement("span");
                            label.innerText = key;

                            let input = document.createElement("input");
                            input.type = "radio";
                            input.value = i;
                            input.name = "n" + simulateQuiz.questions[qindex].index;

                            label.appendChild(input);
                            label.appendChild(span);
                            span.className = "checkmark";
                            label.className = "container";
                            questionBlock.appendChild(label);
                            pageBlock.appendChild(questionBlock);
                            welcomeDiv.appendChild(pageBlock);
                            i++;
                        }

                        questionBlock.appendChild(noteBlock);
                        if (simulateQuiz.questions[qindex].correctIndex == null) {
                            console.log("ERROR Q" + simulateQuiz.questions[qindex].numb);
                        }
                        if (simulateQuiz.questions[qindex].notes == null) {
                            console.log("ERROR Q" + simulateQuiz.questions[qindex].numb);
                        }

                    }
                    let btn = document.createElement("button");
                    btn.innerHTML = "Finalizar";
                    simulateQuiz.timeout = simulateQuiz.COUINTERTIMEOT;
                    simulateQuiz.timer = window.setInterval(simulateQuiz.checkTimer, 1000);
                    btn.onclick = simulateQuiz.checkQuestions;
                    indexBlock.appendChild(btn);

                    var couterBlock = document.createElement("div");
                    couterBlock.id = "couter";
                    indexBlock.appendChild(couterBlock);

                    console.log("Unaswered" + numberOfUnaswered);

                } else {
                    console.log("Status error: " + ajaxRequest.status);
                }
            } else {
                console.log("Ignored readyState: " + ajaxRequest.readyState);
            }
        };
        ajaxRequest.open('GET', json);
        ajaxRequest.send();
    }
}
