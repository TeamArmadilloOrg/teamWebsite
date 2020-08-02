import chalk from "chalk";

function errorPrompt(message) {
	const header = chalk.bgRed.black(" ❌️ ERROR: ");
	const prefix = chalk.red("│");
	const footer = chalk.red("└");

	function appendPrefix(lineOfMessage) {
		return chalk.red`${prefix} ${lineOfMessage}`;
	}

	if (Array.isArray(message)) {
		const joinedMessages = message.map(appendPrefix).join("\n");

		return `\n${header}\n${joinedMessages}\n${footer}`;
	} else {
		return `\n${header}\n${appendPrefix(message)}\n${footer}`;
	}
}

export default errorPrompt;
