import path from "path";
import fs from "fs";
import chalk from "chalk";

function userPrompt(message) {
	const personalLillyConfigPath = path.join(
		"config",
		"CLI",
		"lilly.config.json"
	);
	const configExists = fs.existsSync(personalLillyConfigPath);
	let prefix;

	if (configExists) {
		let personalLillyConfig = JSON.parse(
			fs.readFileSync(personalLillyConfigPath).toString()
		);
		prefix = chalk.bgCyan.black(
			` ${personalLillyConfig.name} ${personalLillyConfig.emoji.icon}: `
		);
	} else {
		prefix = chalk.bgCyan.black(" YOU ?: ");
	}

	if (message) {
		if (Array.isArray(message)) {
			const joinedMessages = message
				.map(function appendPrefix(message) {
					return `${prefix} ${chalk.white(message)}`;
				})
				.join("\n");

			return joinedMessages;
		} else {
			return `${prefix} ${chalk.white(message)}`;
		}
	} else {
		return prefix;
	}
}

export default userPrompt;
