#!/usr/bin/env node
const { execSync } = require("child_process");

const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/OmerBresinski/ReactStarter.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`%c Installing react-9178..`, "color: #00BFFF");

const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) {
    process.exit(-1);
}
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
    process.exit(-1);
}

console.log(`%c Successfully installed react-9178, you love to see it`, "color: #00FF7F");
console.log(`%c cd ${repoName} && npm start`, "color: #00FF7F");
