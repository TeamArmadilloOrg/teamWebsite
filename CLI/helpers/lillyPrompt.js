import chalk from "chalk";

function lillyPrompt(message) {
	const prefix = chalk.bgGray.black(" Lilly 🦔: ");

	if (message) {
		if (Array.isArray(message)) {
			const joinedMessages = message
				.map(function appendPrefix(message) {
					return chalk.whiteBright(`${prefix} ${message}`);
				})
				.join("\n");

			return joinedMessages;
		} else {
			return chalk.whiteBright(`${prefix} ${message}`);
		}
	} else {
		return prefix;
	}
}

export default lillyPrompt;
