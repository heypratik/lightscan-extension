window.addEventListener('load', function () {
    // Get all keys from local storage
    const keys = Object.keys(localStorage);

    // Filter out the keys that start with "Lightscan-answers-"
    const answerKeys = keys.filter(key => key.startsWith("Lightscan-answers-"));

    // Loop through the answer keys and get the corresponding values
    answerKeys.forEach(key => {
        const question = atob(key.split("-")[2]);
        const answer = localStorage.getItem(key);

        // Create card element
        const card = document.createElement("div");
        card.classList.add("answer-card");

        const cardHeader = document.createElement("div");
        cardHeader.style.display = "flex";

        const userIcon = document.createElement("i");
        userIcon.classList.add("fa", "fa-user");
        userIcon.setAttribute("aria-hidden", "true");

        const cardQuestion = document.createElement("h3");
        cardQuestion.classList.add("card-question");
        cardQuestion.style.fontSize = "15px";
        cardQuestion.style.marginLeft = "10px";
        cardQuestion.textContent = question;

        cardHeader.appendChild(userIcon);
        cardHeader.appendChild(cardQuestion);
        card.appendChild(cardHeader);

        const cardAnswer = document.createElement("div");
        cardAnswer.style.display = "flex";
        cardAnswer.style.alignItems = "flex-start";
        cardAnswer.style.marginTop = "5px";

        const answerIcon = document.createElement("img");
        answerIcon.setAttribute("src", "./Frame 15.svg");
        answerIcon.style.width = "15px";
        answerIcon.style.marginTop = "5px";

        const cardAnswerText = document.createElement("p");
        cardAnswerText.classList.add("card-answer");
        cardAnswerText.style.fontSize = "14px";
        cardAnswerText.style.marginLeft = "10px";
        cardAnswerText.textContent = answer;

        cardAnswer.appendChild(answerIcon);
        cardAnswer.appendChild(cardAnswerText);
        card.appendChild(cardAnswer);

        const cardIcons = document.createElement("div");
        cardIcons.classList.add("card-icons");

        const TrashIcon = document.createElement("i");
        TrashIcon.classList.add("fa", "fa-trash-o");
        TrashIcon.setAttribute("aria-hidden", "true");

        TrashIcon.addEventListener("click", function() {
            localStorage.removeItem(`Lightscan-answers-${btoa(question)}`);
            card.remove(); // Remove card element from answer container
            checkEmptyState()
        });

        cardIcons.appendChild(TrashIcon);
        card.appendChild(cardIcons);

        // Append card element to answer container
        const answerContainer = document.querySelector(".answer-container");
        answerContainer.appendChild(card);
    });

    if (answerKeys.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.classList.add("empty-state");

        const emptyStateText = document.createElement("p");
        emptyStateText.textContent = "You have no bookmarks yet. Start scanning to get started!";

        emptyState.appendChild(emptyStateText);
        const answerContainer = document.querySelector(".answer-container");
        answerContainer.appendChild(emptyState);
    }
});

function checkEmptyState() {

    const keys = Object.keys(localStorage);
    const answerKeys = keys.filter(key => key.startsWith("Lightscan-answers-"));

    if (answerKeys.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.classList.add("empty-state");

        const emptyStateText = document.createElement("p");
        emptyStateText.textContent = "You have no bookmarks yet. Start scanning to get started!";

        emptyState.appendChild(emptyStateText);
        const answerContainer = document.querySelector(".answer-container");
        answerContainer.appendChild(emptyState);
    }
}

