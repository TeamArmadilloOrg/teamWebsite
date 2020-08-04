import path from "path";
import fs from "fs";
import chalk from "chalk";
import yargs from "yargs";

import "@/CLI/helpers/prompts.js";

import createPersonalLillyConfig from "@/CLI/helpers/createPersonalLillyConfig.js";
import assist from "@/CLI/commands/assist.js";

function loadPersonalLillyConfig() {
	const personalLillyConfigPath = path.resolve(
		"config",
		"CLI",
		"lilly.config.json"
	);

	if (fs.existsSync(personalLillyConfigPath)) {
		return JSON.parse(fs.readFileSync(personalLillyConfigPath).toString());
	} else {
		return createPersonalLillyConfig();
	}
}

(async function init() {
	global.personalLillyConfig = await loadPersonalLillyConfig();
	UserPrompt.name = personalLillyConfig.name;
	UserPrompt.emoji = personalLillyConfig.emoji;

	if (yargs.argv._.length == 0) {
		LillyPrompt.log([
			`Hello ${personalLillyConfig.emoji} ${chalk.cyanBright(
				personalLillyConfig.name
			)}, good to see you again!`,
		]);
		assist(personalLillyConfig);
	}
})();
