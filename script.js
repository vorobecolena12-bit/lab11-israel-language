$(document).ready(function () {
    let dictionary = [
        { he: "שלום", ua: "привіт" },
        { he: "תודה", ua: "дякую" },
        { he: "משפחה", ua: "сім'я" },
        { he: "אהבה", ua: "кохання" },
        { he: "שמש", ua: "сонце" },
        { he: "מים", ua: "вода" },
        { he: "ספר", ua: "книга" },
        { he: "זמן", ua: "час" },
        { he: "חבר", ua: "друг" },
        { he: "חיים", ua: "життя" },
        { he: "לחם", ua: "хліб" },
        { he: "יום", ua: "день" },
        { he: "לילה", ua: "ніч" },
        { he: "עיר", ua: "місто" },
        { he: "חתול", ua: "кіт" }
    ];
    const adBanners = [
        {  img: "politica.jpg",  text: "Голосуйте за Біньяміна Нетаньягу на виборах в Ізраїлі!"},
        { img: "passport.jpg",  text: "Знайдемо в будь-кого ізраїльське коріння! Недорого та швидко(+38 067 58 222 16)" },
        { img: "hal.jpg", text: "ЦАХАЛ - це гордість Ізраїлю!(+380 67 770 35 36)"}
    ];
    let currentIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let cardStates = [];
    let adShownAtSteps = []; 
    function startGame() {
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;
        cardStates = [null, null, null, null, null, null, null, null, null, null]; 
        adShownAtSteps = []; 
        $("#correct-count").text(correctCount);
        $("#wrong-count").text(wrongCount);
        $("#result-modal").fadeOut();
        $("#political-ad").fadeOut(); 
        dictionary.sort(() => Math.random() - 0.5);
        showWord();
    }
    function showWord() {
        let currentWord = dictionary[currentIndex];
        $("#current-word").text(currentWord.he);
        $("#step-counter").text((currentIndex + 1) + "/10");
        $("#validation-error").text(""); 
        $("#word-card").removeClass("card-correct card-wrong"); 
        if (cardStates[currentIndex] === null) {
            $("#translation-input").val("").prop("disabled", false).focus();
        } else {
            $("#translation-input").prop("disabled", true);
            if (cardStates[currentIndex] === true) {
                $("#word-card").addClass("card-correct");
            } else {
                $("#word-card").addClass("card-wrong");
                $("#validation-error").text("Правильно: " + currentWord.ua);
            }
        }
        showAdRandomly();
    }
    function showAdRandomly() {
        if (adShownAtSteps.includes(currentIndex)) return;
        const chanceToShow = 0.3; 
        const lastAdStep = adShownAtSteps.length > 0 ? adShownAtSteps[adShownAtSteps.length - 1] : -3;
        if ((currentIndex - lastAdStep >= 3) && (Math.random() < chanceToShow)) {
            const randomAd = adBanners[Math.floor(Math.random() * adBanners.length)];
            $("#ad-content-wrapper").html(`
                <img src="${randomAd.img}" alt="Реклама" class="ad-image">
                <p class="ad-text">${randomAd.text}</p> `);
            $("#political-ad").fadeIn(600);
            adShownAtSteps.push(currentIndex);
        }
    }
    $("#word-card").click(function () {
        if (cardStates[currentIndex] !== null) return;
        let answer = $("#translation-input").val().trim().toLowerCase();
        if (answer === "") {
            $("#validation-error").text("Введіть переклад!");
            return;
        }
        let ukrainianRegex = /^[а-щьюяіїєґ' -]+$/i;
        if (!ukrainianRegex.test(answer)) {
            $("#validation-error").text("Тільки українські літери!");
            return;
        }
        $("#translation-input").prop("disabled", true);
        $("#validation-error").text("");
        if (answer === dictionary[currentIndex].ua) {
            correctCount++;
            $("#correct-count").text(correctCount);
            $("#word-card").addClass("card-correct");
            cardStates[currentIndex] = true; 
        } else {
            wrongCount++;
            $("#wrong-count").text(wrongCount);
            $("#word-card").addClass("card-wrong");
            $("#validation-error").text("Правильно: " + dictionary[currentIndex].ua);
            cardStates[currentIndex] = false; 
        }
        $("#political-ad").fadeOut(300);
        setTimeout(function () {
            if (!cardStates.includes(null)) {
                showResults();
            } else if (currentIndex < 9) {
                currentIndex++;
                showWord();
            }
        }, 1000); 
    });
    $("#translation-input").on("keydown", function (e) {
        if (e.key === "Enter") {
            $("#word-card").click();
        }
    });
    $("#next-btn").click(function () {
        if (currentIndex < 9) {
            $("#political-ad").fadeOut(300);
            currentIndex++;
            showWord();
        }
    });
    $("#prev-btn").click(function () {
        if (currentIndex > 0) {
            $("#political-ad").fadeOut(300);
            currentIndex--;
            showWord();
        }
    });
    $("#close-ad").click(function () {
        $("#political-ad").fadeOut(300);
    });
  function showResults() {
        $("#modal-score").text("Вірно: " + correctCount + " з 10");
        let gifUrl = ""; 
        if (correctCount >= 8) {
            $("#modal-level").text("ХАКЕР").css("color", "#4caf50");
            gifUrl = "edit.gif";
        } else if (correctCount >= 5) {
            $("#modal-level").text("ПРО").css("color", "#FFC107");
            gifUrl = "netanyahu-dancing.gif"; 
        } else {
            $("#modal-level").text("НУБ").css("color", "#f44336");
            gifUrl = "benjamin-netanyahu-epstein.gif"; 
        }
        $("#modal-gif").attr("src", gifUrl).show();
        $("#result-modal").css("display", "flex").hide().fadeIn(300);
    }
    $("#restart-btn").click(startGame);
    startGame();
});