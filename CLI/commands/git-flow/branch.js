import chalk from "chalk";
import inquirer from "inquirer";
import Git from "nodegit";

import lillyPrompt from "@/CLI/helpers/lillyPrompt.js";
import userPrompt from "@/CLI/helpers/userPrompt.js";
import warningPrompt from "@/CLI/helpers/warningPrompt.js";

async function branch(personalLillyConfig) {
	async function createNewBranch(branchName) {
		let localRepository = await Git.Repository.open("./");
		let lastCommitInDevelopBranch = await localRepository.getBranchCommit(
			"develop"
		);

		await Git.Branch.create(
			localRepository,
			branchName,
			lastCommitInDevelopBranch,
			false
		);
		console.log(
			lillyPrompt(
				`I have successfully created a new branch: ${chalk.green(
					branchName
				)}!`
			)
		);

		await localRepository.checkoutBranch(branchName);
		console.log(
			lillyPrompt(
				`I'm going to ${chalk.cyan(
					"checkout"
				)} to this branch for you as well.`
			)
		);
	}

	function testBranchName(branchName) {
		return {
			isSnakeCase: branchName.includes("_"),
			startsWithName: new RegExp(`^${personalLillyConfig.name}`).test(
				branchName
			),
			isLowerCase: branchName == branchName.toLowerCase(),
		};
	}

	function validateBranchName(branchName) {
		function hasPassedTest(value) {
			return value;
		}

		return Object.values(testBranchName(branchName)).every(hasPassedTest);
	}

	function fixBranchName(branchName) {
		let tests = testBranchName(branchName);

		if (!tests.startsWithName) {
			return `${personalLillyConfig.name.toLowerCase()}_${branchName}`;
		}
		console.log(
			lillyPrompt([
				"No worries, I'll fix the branch branchName for you!",
				`Fixed branch branchName will be: ${chalk.green(branchName)}`,
			])
		);
	}

	let questionAboutNewBranch = {
		name: "newBranchPurpose",
		type: "list",
		prefix: userPrompt(),
		message: "...",
		choices: [
			{
				name: `for a specific ${chalk.blue(
					"Jira"
				)} Issue Id (new feature).`,
				value: "jiraIssueId",
			},
			{
				name: `with a ${chalk.blue("custom")} name.`,
				value: "customName",
			},
		],
	};
	const { newBranchPurpose } = await inquirer.prompt(questionAboutNewBranch);
	let newBranchName;

	switch (newBranchPurpose) {
		case "jiraIssueId": {
			let questionAboutJiraIssueId = {
				name: "jiraIssueId",
				type: "number",
				prefix: `\n${lillyPrompt()}`,
				message: `What's the number of ${chalk.cyan(
					"Jira Issue Id"
				)} you want to work on?`,
				suffix: `\n${userPrompt()}`,
				validate: function (inputJiraIssueId) {
					return /^\d/.test(inputJiraIssueId);
				},
			};
			const { jiraIssueId } = await inquirer.prompt(
				questionAboutJiraIssueId
			);

			newBranchName = `${personalLillyConfig.name.toLowerCase()}_feature_TAWS-${jiraIssueId}`;
			console.log(
				lillyPrompt(
					`Alright, the new branch name will be: ${chalk.green(
						newBranchName
					)}`
				)
			);

			break;
		}

		case "customName": {
			let questionAboutBranchName = {
				name: "userProposedBranchName",
				prefix: lillyPrompt(),
				suffix: `\n${userPrompt()}`,
				message: `How would you like to ${chalk.cyan(
					"name"
				)} this branch?`,
				type: "input",
			};
			const { userProposedBranchName } = await inquirer.prompt(
				questionAboutBranchName
			);
			const isValidBranchName = validateBranchName(
				userProposedBranchName
			);

			if (!isValidBranchName) {
				console.warn(
					warningPrompt([
						`Following the ${chalk.whiteBright(
							'"Git flow"'
						)} from our developer guide on Confluence pages:`,
						chalk.cyan(
							"https://teamarmadillo.atlassian.net/wiki/spaces/TA/pages/30736402/01+GitFlow"
						),
						`Your newly created branch name should always start with your ${chalk.yellowBright(
							"name"
						)} in lowercase, and append the rest with snake_case.`,
					])
				);

				newBranchName = fixBranchName(userProposedBranchName);
			} else {
				newBranchName = userProposedBranchName;
			}

			break;
		}
	}

	createNewBranch(newBranchName);
	console.log(
		lillyPrompt([
			"By the way, if you would like to do this yourself without my help...",
			`... simply use this command: ${chalk.bgWhite.black(
				` git checkout -b ${newBranchName} `
			)}`,
		])
	);
}

export default branch;
