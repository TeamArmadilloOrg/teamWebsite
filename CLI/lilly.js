import path from "path";
import fs from "fs";
import chalk from "chalk";
import yargs from "yargs";

import createPersonalLillyConfig from "@/CLI/helpers/createPersonalLillyConfig.js";
import lillyPrompt from "@/CLI/helpers/lillyPrompt.js";
import assist from "@/CLI/commands/assist.js";

function getPersonalLillyConfig() {
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
	let personalLillyConfig = await getPersonalLillyConfig();

	console.log(
		lillyPrompt([
			`Hello ${chalk.blueBright(personalLillyConfig.name)} ${
				personalLillyConfig.emoji.icon
			}, good to see you again!`,
		])
	);

	if (yargs.argv._.length == 0) {
		assist(personalLillyConfig);
	}
})();
