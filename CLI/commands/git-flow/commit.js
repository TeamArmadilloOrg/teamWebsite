import inquirer from "inquirer";
import chalk from "chalk";
import Git from "nodegit";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

import lillyPrompt from "@/CLI/helpers/lillyPrompt.js";
import userPrompt from "@/CLI/helpers/userPrompt.js";
import notePrompt from "@/CLI/helpers/notePrompt.js";
import infoPrompt from "@/CLI/helpers/infoPrompt.js";

async function commit(personalLillyConfig) {
	let questionAboutCommitLength = {
		name: "commitLength",
		type: "list",
		prefix: lillyPrompt(),
		message: `${chalk.cyan(
			"How lengthy"
		)} do you expect your commit message to be?`,
		suffix: `\n${userPrompt()}`,
		choices: [
			{
				name: `A ${chalk.blue("short")} one.`,
				value: "short",
			},
			{
				name: `A ${chalk.blue("long")} one.`,
				value: "long",
			},
		],
	};

	const { commitLength } = await inquirer.prompt(questionAboutCommitLength);

	await callGitCommit(commitLength, personalLillyConfig);
}

async function callGitCommit(length, personalLillyConfig) {
	async function getJiraIssueTag() {
		let localRepository = await Git.Repository.open("./");
		let currentBranch = await localRepository.getCurrentBranch();
		const branchName = await currentBranch.shorthand();

		return branchName.match(/(TAWS-\d+)$/)[0];
	}

	const jiraIssueTag = await getJiraIssueTag();

	function appendEmojiAndJiraIssueTag(commitMessage) {
		return `${personalLillyConfig.emoji.icon}[${jiraIssueTag}] ${commitMessage}`;
	}

	let gitCommitCommandArguments;

	if (length == "short") {
		const allowedCommitLength = 50;
		console.log(
			infoPrompt([
				`You should wrap your commit message within ${chalk.white(
					`${allowedCommitLength} characters`
				)}.`,
				"Including your emoji and Jira Issue tag as well.",
			])
		);

		let questionAboutCommitMessage = {
			name: "commitMessage",
			type: "input",
			prefix: lillyPrompt(),
			message: `What's the commit ${chalk.cyan("message?")}`,
			transformer: function provideLengthFeedback(inputCommitMessage) {
				inputCommitMessage = appendEmojiAndJiraIssueTag(
					inputCommitMessage
				);

				const remainingCharactersLeft =
					allowedCommitLength - inputCommitMessage.length;
				const counter = chalk.grey(
					`(${
						remainingCharactersLeft > 0
							? remainingCharactersLeft
							: 0
					} remaining characters left)`
				);

				if (inputCommitMessage.length <= allowedCommitLength) {
					return `${counter}\n${userPrompt(inputCommitMessage)}`;
				} else {
					const withinAllowedCommitLength = inputCommitMessage.substring(
						0,
						allowedCommitLength
					);
					const outsideAllowedCommitLength = inputCommitMessage.substring(
						allowedCommitLength
					);

					return `${counter}\n${userPrompt([
						`${withinAllowedCommitLength}${chalk.red(
							outsideAllowedCommitLength
						)}`,
					])}`;
				}
			},
		};
		const { commitMessage } = await inquirer.prompt(
			questionAboutCommitMessage
		);
		gitCommitCommandArguments = [
			"commit",
			"-m",
			`${appendEmojiAndJiraIssueTag(commitMessage)}`,
		];
		console.log(
			notePrompt([
				"If you would like to do this task without the help of Lilly,",
				"you can use this command:",
				`${chalk.bgWhite.black(
					` git commit -m "${appendEmojiAndJiraIssueTag(
						commitMessage
					)}" `
				)}`,
			])
		);
	} else if (length == "long") {
		gitCommitCommandArguments = [
			"commit",
			"--template",
			autoFilledTemplatePath,
		];
		const commitTemplatePath = path.join(
			"./",
			"config",
			"git-commit-template.txt"
		);
		const commitTemplate = fs.readFileSync(commitTemplatePath).toString();
		const autoFilledCommitTemplate = commitTemplate
			.replace("JIRA-ISSUE-ID", jiraIssueTag)
			.replace(":your_emoji:", personalLillyConfig.emoji.icon);
		const autoFilledTemplatePath = commitTemplatePath.replace(
			"git-commit-template",
			"autoFilled-commit-template"
		);

		console.log(
			notePrompt([
				"If you would like to do this task without the help of Lilly,",
				"simply use this command:",
				`${chalk.bgWhite.black(
					` git commit --template ${commitTemplatePath}`
				)}`,
			])
		);

		await fs.writeFileSync(
			autoFilledTemplatePath,
			autoFilledCommitTemplate
		);

		await callGitCommit.on(
			"close",
			function removeAutoFilledCommitTemplateFile() {
				fs.unlinkSync(autoFilledTemplatePath);
			}
		);
	}

	let callGitCommand = spawn("git", gitCommitCommandArguments, {
		stdio: "inherit",
	});

	callGitCommand.on("exit", function runAfterExit() {
		console.log(
			lillyPrompt([
				"Successfully created commit!",
				"You can preview it below:",
			])
		);
		spawn("git", ["log", "-1"], { stdio: "inherit" });
	});
}

export default commit;
