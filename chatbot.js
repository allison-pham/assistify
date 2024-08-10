let button = document.getElementById("submitButton");
button.addEventListener('click', function () {
    let text = document.getElementById("message").value;
    console.log(text);

    let displayArea = document.getElementById("displayArea");
    displayArea.textContent = text;

    let botText = document.getElementById("botText");
    if (text === "1") {

        botText.textContent = "You have selected technical interview preparation.";
    }
    else if (text === "2") {

        botText.textContent = "You have selected technical support.";
    }

    else if (text === "3") {

        botText.textContent = "You have selected account management.";
    }
    else {

        botText.textContent = "Please enter a valid response.";
    }
})