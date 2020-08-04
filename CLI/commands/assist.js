import inquirer from "inquirer";
import chalk from "chalk";

import { scripts } from "@/package.json";
import runScript from "@/CLI/commands/runScript.js";
import runBranchTask from "@/CLI/commands/git-flow/branch.js";
import runCommitTask from "@/CLI/commands/git-flow/commit.js";

async function assist() {
	let questions = [
		{
			name: "task",
			message: `How I can ${chalk.cyan("assist")} you?`,
			prefix: LillyPrompt.prefix,
			suffix: `\n${UserPrompt.prefix}`,
			type: "list",
			pageSize: 15,
			choices: [
				new inquirer.Separator("-- Git flow --"),
				{
					name: `Create a new ${chalk.blue("branch")}...`,
					value: "git:branch",
				},
				{
					name: `${chalk.blue("Commit")} the changes`,
					value: "git:commit",
				},
				new inquirer.Separator("-- Development - CLI --"),
				{
					name: `${chalk.blue("Start")} developing the ${chalk.blue(
						"CLI"
					)} project with webpack watch mode (automatically recompile on file changes)`,
					value: "start:CLI",
				},
				{
					name: `${chalk.blue("Build")} the Lilly ${chalk.blue(
						"CLI"
					)} project from "CLI" directory in the ${chalk.blue(
						"development"
					)} environment`,
					value: "build:CLI development",
				},
				new inquirer.Separator("-- Development - website --"),
				{
					name: `${chalk.blue(
						"Start"
					)} the development server for the ${chalk.blue(
						"website"
					)} project with webpack`,
					value: "start:website",
				},
				{
					name: `${chalk.blue("Build")} the ${chalk.blue(
						"website"
					)} project from "source" directory in ${chalk.blue(
						"development"
					)} environment`,
					value: "build:website development",
				},
				new inquirer.Separator("-- Other --"),
				{
					name: `${chalk.blue(
						"Check"
					)} the code style in "source" with Prettier`,
					value: "check:all",
				},
				{
					name: `${chalk.blue(
						"Lint"
					)} (analyze) the script files (${chalk.blue(
						"js"
					)}) with ESlint`,
					value: "lint:js",
				},
			],
		},
	];
	const { task } = await inquirer.prompt(questions);

	const command = task.match(/\w+:\w+/)[0];
	const argumentsPassedToCommand = task.match(/(?<=\s)(\w+)/)
		? task.match(/(?<=\s)(\w+)/)[0]
		: null;

	if (Object.keys(scripts).includes(command)) {
		runScript(command, argumentsPassedToCommand);
	} else if (task == "git:branch") {
		await runBranchTask();
	} else if (task == "git:commit") {
		await runCommitTask();
	}
}

export default assist;
