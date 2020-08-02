import chalk from "chalk";
import { spawn } from "child_process";

import notePrompt from "@/CLI/helpers/notePrompt.js";

async function runScript(command, argumentsPassedToCommand) {
	console.log(
		notePrompt([
			"If you would like to do this task without the help of Lilly,",
			"simply use this command:",
			`${chalk.bgWhite.black(
				` pnpm ${command}${
					argumentsPassedToCommand
						? ` ${argumentsPassedToCommand}`
						: ""
				} `
			)}`,
		])
	);

	await spawn(
		"pnpm",
		[command, argumentsPassedToCommand ? argumentsPassedToCommand : ""],
		{
			stdio: "inherit",
		}
	);
}

export default runScript;
