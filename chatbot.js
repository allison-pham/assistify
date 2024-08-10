// The Readline module allows reading of input stream line by line
const readline = require("node:readline");

// Create an instance of a readline interface which allows for command-line input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`Hello, how can I help you? Press 1 for technical interview preparation, press 2 for technical support, press 3 for account management. `, (selection) => {
    if (selection === "1") {
        console.log("You have selected technical interview preparation.");
    }
    else if (selection === "2") {
        console.log("You have selected technical support.");
    }
    else if (selection === "3") {
        console.log("You have selected account management.");
    } else {
        console.log("Please enter a valid response.");
    }
    rl.close();
});
