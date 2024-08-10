// The Readline module allows reading of input stream line by line
const readline = require("node:readline");

// Create an instance of a readline interface which allows for command-line input and output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`Hello, how can I help you? Press 1 for technical interview preparation `, (selection) => {
    if (selection === "1") {
        console.log("You have selected technical interview preparation");
    }
    rl.close();
});
