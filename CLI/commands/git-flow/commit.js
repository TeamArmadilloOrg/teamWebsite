import inquirer from "inquirer";
import chalk from "chalk";
import Git from "nodegit";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import stringLength from "string-length";

async function getJiraIssueTag() {
	let localRepository = await Git.Repository.open("./");
	let currentBranch = await localRepository.getCurrentBranch();
	const branchName = await currentBranch.shorthand();

	return branchName.match(/(TAWS-\d+)$/)[0];
}

async function commit() {
	async function callGitCommit(length) {
		const jiraIssueTag = await getJiraIssueTag();

		function appendEmojiAndJiraIssueTag(commitMessage) {
			return `${personalLillyConfig.emoji}[${jiraIssueTag}] ${commitMessage}`;
		}

		let gitCommitCommandArguments;

		if (length == "short") {
			const allowedCommitLength = 50;

			InfoPrompt.log([
				`You should wrap your commit message within ${chalk.white(
					`${allowedCommitLength} characters`
				)}.`,
				"Including your emoji and Jira Issue tag as well.",
			]);

			let questionAboutCommitMessage = {
				name: "commitMessage",
				type: "input",
				prefix: LillyPrompt.prefix,
				message: `What's the commit ${chalk.cyan("message?")}`,
				suffix: `\n${UserPrompt.prefix}`,
				transformer: function provideVisualCommitLengthFeedback(
					inputCommitMessage
				) {
					const fullCommitMessage = appendEmojiAndJiraIssueTag(
						inputCommitMessage
					);
					const fullCommitMessageLength = stringLength(
						fullCommitMessage
					);

					const remainingCharactersLeft =
						allowedCommitLength - fullCommitMessageLength;
					const counter = chalk.grey(
						`(${
							remainingCharactersLeft > 0
								? remainingCharactersLeft
								: 0
						} remaining characters left)`
					);

					if (
						stringLength(fullCommitMessage) <= allowedCommitLength
					) {
						return `${counter}\n${UserPrompt.prefix} ${chalk[
							UserPrompt.textStyles.color
						](fullCommitMessage)}`;
					} else {
						const astralSymbolsLength =
							fullCommitMessage.length -
							stringLength(fullCommitMessage);
						const withinAllowedCommitLength = fullCommitMessage.substring(
							0,
							allowedCommitLength + astralSymbolsLength
						);
						const outsideAllowedCommitLength = fullCommitMessage.substring(
							allowedCommitLength + astralSymbolsLength
						);

						return `${counter}\n${UserPrompt.prefix} ${chalk[
							UserPrompt.textStyles.color
						](withinAllowedCommitLength)}${chalk.red(
							outsideAllowedCommitLength
						)}`;
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

			NotePrompt.log([
				"If you would like to do this task without the help of Lilly,",
				"you can use this command:",
				`${chalk.bgWhite.black(
					` git commit -m "${appendEmojiAndJiraIssueTag(
						commitMessage
					)}" `
				)}`,
			]);
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
			const commitTemplate = fs
				.readFileSync(commitTemplatePath)
				.toString();
			const autoFilledCommitTemplate = commitTemplate
				.replace("JIRA-ISSUE-ID", jiraIssueTag)
				.replace(":your_emoji:", personalLillyConfig.emoji.icon);
			const autoFilledTemplatePath = commitTemplatePath.replace(
				"git-commit-template",
				"autoFilled-commit-template"
			);

			NotePrompt.log([
				"If you would like to do this task without the help of Lilly,",
				"simply use this command:",
				`${chalk.bgWhite.black(
					` git commit --template ${commitTemplatePath}`
				)}`,
			]);

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
			LillyPrompt.log([
				"Successfully created commit!",
				"You can preview it below:",
			]);
			spawn("git", ["log", "-1"], { stdio: "inherit" });
		});
	}
	let questionAboutCommitLength = {
		name: "commitLength",
		type: "list",
		prefix: LillyPrompt.prefix,
		message: `${chalk.cyan(
			"How lengthy"
		)} do you expect your commit message to be?`,
		suffix: `\n${UserPrompt.prefix}`,
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

	await callGitCommit(commitLength);
}

export default commit;
