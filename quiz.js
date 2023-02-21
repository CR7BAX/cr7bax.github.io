class Quiz {
    static messagesArray = {};
    static pageBlocks = [];
    static currentPage = 0;
    constructor(json) {
        this.jsonFile = json;

        this.createQuiz();
    }

    checkQuestion() {
        const index = parseInt(this.value);
        const question = Quiz.messagesArray.questions[index];
        const answer = question.correctIndex;
        const elements = document.getElementsByName('n' + index);

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                if (answer - 1 === i) {
                    this.style.background = "#00FF00";
                    this.innerHTML = "CERTO";
                    return;
                }
            }
        }

        const noteElement = document.getElementById('note' + index);
        noteElement.innerHTML = question.notes;
        this.style.background = "#FF0000";
        this.innerHTML = "ERRADO";
    }

    showPage() {
        var index = parseInt(this.value);

        if (index == 0) {

            index = 0;
        } else {
            index = index/10;
        }
        for (const page of Quiz.pageBlocks) {
            page.style.display = "none";
        }
        Quiz.pageBlocks[index].style.display = "block";
        Quiz.currentPage = index;
    }
    createQuiz() {

        var numberOfUnaswered = 0;
        var questionCounter = 0;
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.quiz = this;
        ajaxRequest.onreadystatechange = function () {

            if (ajaxRequest.readyState == 4) {
                //the request is completed, now check its status
                if (ajaxRequest.status == 200) {
                    //turn JSON into array

                    Quiz.messagesArray = JSON.parse(ajaxRequest.responseText);
                    var welcomeDiv = document.getElementById("welcome");
                    welcomeDiv.innerHTML = "";
                    var indexBlock = document.createElement("div");
                    indexBlock.id = "qIndex";
                    welcomeDiv.appendChild(indexBlock);
                    var index = 0;
                    for (var qindex in Quiz.messagesArray.questions) {
                        var pageBlock;
                        Quiz.messagesArray.questions[qindex].index = index;
                        index++;
                        if (questionCounter == 0) {
                            pageBlock = document.createElement("div");
                            pageBlock.id = "Page" + questionCounter;
                            pageBlock.style.display = "block";
                            let btn = document.createElement("button");
                            btn.innerHTML = questionCounter;
                            btn.value = questionCounter;
                            btn.onclick = this.quiz.showPage;
                            indexBlock.appendChild(btn);
                            Quiz.pageBlocks.push(pageBlock);

                        } else if (questionCounter % 10 == 0) {
                            pageBlock = document.createElement("div");
                            pageBlock.id = "Page" + questionCounter;
                            pageBlock.style.display = "none";
                            let btn = document.createElement("button");
                            btn.innerHTML = questionCounter;
                            btn.value = questionCounter;
                            btn.onclick = this.quiz.showPage;
                            indexBlock.appendChild(btn);
                            Quiz.pageBlocks.push(pageBlock);
                        }
                        questionCounter++;
                        var questionBlock = document.createElement("div");
                        var questiontxt = document.createElement("div");
						questiontxt.className = "question";
                        var noteBlock = document.createElement("div");
                        noteBlock.id = "note" + Quiz.messagesArray.questions[qindex].index;
                        questiontxt.innerHTML = Quiz.messagesArray.questions[qindex].index + ")" + Quiz.messagesArray.questions[qindex].question;

                        questionBlock.appendChild(questiontxt);
                        let i = 1;
                        for (var key of Quiz.messagesArray.questions[qindex].answers) {

                            let label = document.createElement("label");
                            let span = document.createElement("span");
                            label.innerText = key;

                            let input = document.createElement("input");
                            input.type = "radio";
                            input.value = i;
                            input.name = "n" + qindex;
                            //input.questionIndex = messagesArray.questions[qindex].numb;
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
                        if (Quiz.messagesArray.questions[qindex].correctIndex == null) {
                            console.log("ERROR Q" + Quiz.messagesArray.questions[qindex].numb);
                        }
                        if (Quiz.messagesArray.questions[qindex].notes == null) {
                            console.log("ERROR Q" + Quiz.messagesArray.questions[qindex].numb);
                        }

                        if (Quiz.messagesArray.questions[qindex].correctIndex == 0) {
                            let notAvailble = document.createElement("div");
                            notAvailble.innerHTML = "resposta Indisponivel";
                            questionBlock.appendChild(notAvailble);
                            console.log(Quiz.messagesArray.questions[qindex].numb);
                            numberOfUnaswered++;
                        } else {

                            let btn = document.createElement("button");
                            btn.innerHTML = "Verificar";
                            btn.value = qindex;
                            btn.onclick = this.quiz.checkQuestion;
                            questionBlock.appendChild(btn);
                        }
                    }
                    console.log("Unaswered" + numberOfUnaswered);

                } else {
                    console.log("Status error: " + ajaxRequest.status);
                }
            } else {
                console.log("Ignored readyState: " + ajaxRequest.readyState);
            }
        };
        ajaxRequest.open('GET', this.jsonFile);
        ajaxRequest.send();
    }

}
