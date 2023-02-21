
class loadChapter {
	static chapter="";

    constructor(chapter ) {
		loadChapter.chapter=chapter;


        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.onreadystatechange = function () {

            if (ajaxRequest.readyState == 4) {
                //the request is completed, now check its status
                if (ajaxRequest.status == 200) {
                    //turn JSON into array

                    var welcomeDiv = document.getElementById("welcome");
                    welcomeDiv.innerHTML =ajaxRequest.responseText;
                   

                } else {
                    console.log("Status error: " + ajaxRequest.status);
                }
            } else {
                console.log("Ignored readyState: " + ajaxRequest.readyState);
            }
        };
        ajaxRequest.open('GET', 'capitulos/'+loadChapter.chapter+'/index.html');
        ajaxRequest.send();
    }
}
