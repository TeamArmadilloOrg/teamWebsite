import chalk from "chalk";

function notePrompt(message) {
	const header = chalk.bgMagentaBright.black(" 📝 NOTE: ");
	const prefix = chalk.magentaBright("│");
	const footer = chalk.magentaBright("└");

	function appendPrefix(lineOfMessage) {
		return chalk.magentaBright`${prefix} ${lineOfMessage}`;
	}

	if (Array.isArray(message)) {
		const joinedMessages = message.map(appendPrefix).join("\n");

		return `\n${header}\n${joinedMessages}\n${footer}`;
	} else {
		return `\n${header}\n${appendPrefix(message)}\n${footer}`;
	}
}

export default notePrompt;
