import chalk from "chalk";

function warningPrompt(message) {
	const header = chalk.bgYellow.black(" ⚠️ WARNING: ");
	const prefix = chalk.yellow("│");
	const footer = chalk.yellow("└");

	function appendPrefix(lineOfMessage) {
		return chalk.yellow`${prefix} ${lineOfMessage}`;
	}

	if (Array.isArray(message)) {
		const joinedMessages = message.map(appendPrefix).join("\n");

		return `\n${header}\n${joinedMessages}\n${footer}`;
	} else {
		return `\n${header}\n${appendPrefix(message)}\n${footer}`;
	}
}

export default warningPrompt;
