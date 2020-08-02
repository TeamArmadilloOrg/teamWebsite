import path from "path";
import fs from "fs";
import chalk from "chalk";

const personalLillyConfigPath = path.join("config", "CLI", "lilly.config.json");

function userPrompt(message) {
	const configExists = fs.existsSync(personalLillyConfigPath);

	if (configExists) {
		let personalLillyConfig = JSON.parse(
			fs.readFileSync(personalLillyConfigPath).toString()
		);
		const prefix = chalk.bgCyan.black(
			` ${personalLillyConfig.name} ${personalLillyConfig.emoji.icon}: `
		);

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
	} else {
		return `${chalk.bgCyan.black(" YOU ?: ")} ${chalk.white(message)}`;
	}
}

export default userPrompt;
