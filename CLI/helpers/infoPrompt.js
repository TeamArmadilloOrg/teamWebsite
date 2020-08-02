import chalk from "chalk";

function infoPrompt(message) {
	const header = chalk.bgBlueBright.black(" 🔵 INFO: ");
	const prefix = chalk.blueBright("│");
	const footer = chalk.blueBright("└");

	function appendPrefix(lineOfMessage) {
		return chalk.blueBright`${prefix} ${lineOfMessage}`;
	}

	if (Array.isArray(message)) {
		const joinedMessages = message.map(appendPrefix).join("\n");

		return `\n${header}\n${joinedMessages}\n${footer}\n`;
	} else {
		return `\n${header}\n${appendPrefix(message)}\n${footer}\n`;
	}
}

export default infoPrompt;
