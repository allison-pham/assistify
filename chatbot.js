// The Readline module allows reading of input stream line by line
const readline = require("node:readline");

// Create an instance of a readline interface which allows for command-line input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`What's your name? `, (name) => {
  console.log(`Hi ${name}!`);
  rl.close();
});
