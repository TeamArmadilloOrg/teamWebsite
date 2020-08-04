import chalk from "chalk";
import inquirer from "inquirer";
import Git from "nodegit";

async function runBranchTask() {
	const userName = personalLillyConfig.name.toLowerCase();
	const jiraTag = "TAWS";

	async function createNewBranch(branchName) {
		let localRepository = await Git.Repository.open("./");
		let lastCommitInDevelopBranch = await localRepository.getBranchCommit(
			"develop"
		);

		try {
			await Git.Branch.create(
				localRepository,
				branchName,
				lastCommitInDevelopBranch,
				false
			);

			LillyPrompt.log(
				`I have successfully created a new branch: ${chalk.green(
					branchName
				)}!`
			);

			try {
				await localRepository.checkoutBranch(branchName);
				LillyPrompt.log(
					`I'm going to ${chalk.cyan(
						"checkout"
					)} to this branch for you as well.`
				);
			} catch {
				WarningPrompt.log(
					"You have untracked/uncommitted changes in this current branch."
				);
				LillyPrompt.log(
					"Sorry, I can't checkout to the new branch for you. You must deal with these conflicts firstly."
				);
			}
		} catch {
			ErrorPrompt.log(
				"This branch name already exists in your local repository."
			);
		}
	}

	let questionAboutNewBranch = {
		name: "newBranchPurpose",
		type: "list",
		prefix: UserPrompt.prefix,
		message: chalk.cyan("..."),
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

	InfoPrompt.log([
		`Following the ${chalk.whiteBright(
			'"Git flow"'
		)} from our developer guide on Confluence pages:`,
		chalk.whiteBright(
			"https://teamarmadillo.atlassian.net/wiki/spaces/TA/pages/30736402/01+GitFlow"
		),
		`Your newly created branch name should always start with your ${chalk.whiteBright(
			"name"
		)} in lowercase,`,
		`and append the rest with ${chalk.whiteBright(
			"snake_case"
		)} (except Jira Tag).`,
	]);

	let newBranchName = `${userName}_`;

	switch (newBranchPurpose) {
		case "jiraIssueId": {
			let questionAboutJiraIssueId = {
				name: "jiraIssueId",
				type: "number",
				prefix: `\n${LillyPrompt.prefix}`,
				message: `What's the number of the ${chalk.cyan(
					"Jira Issue Id"
				)} you want to work on?`,
				suffix: `\n${UserPrompt.prefix}`,
				validate: function (inputJiraIssueId) {
					return /^\d/.test(inputJiraIssueId);
				},
				transformer: function appendTheRestOfName(inputJiraIssueId) {
					return chalk.cyan(
						`${userName}_feature_${jiraTag}-${inputJiraIssueId}`
					);
				},
			};
			const { jiraIssueId } = await inquirer.prompt(
				questionAboutJiraIssueId
			);

			newBranchName += `feature_${jiraTag}-${jiraIssueId}`;
			break;
		}

		case "customName": {
			let questionAboutCustomName = {
				name: "customName",
				prefix: LillyPrompt.prefix,
				suffix: `\n${UserPrompt.prefix}`,
				message: `How would you like to ${chalk.cyan(
					"name"
				)} this branch?`,
				type: "input",
				transformer: function appendName(customNameInput) {
					return `${userName}_${customNameInput}`;
				},
			};
			const { customName } = await inquirer.prompt(
				questionAboutCustomName
			);

			newBranchName += `${customName}`;
			break;
		}
	}

	LillyPrompt.log(
		`Alright, the new branch name will be: ${chalk.green(newBranchName)}`
	);

	createNewBranch(newBranchName);

	NotePrompt.log([
		"If you would like to do this task by yourself - without the help of Lilly,",
		"use these commands:",
		"1. To create a new branch:",
		`${chalk.bgWhite.black(` git branch ${newBranchName} `)}`,
		"2. Checkout (switch) to this new branch:",
		`${chalk.bgWhite.black(` git checkout ${newBranchName} `)}`,
		"",
		"Alternatively, if you want to use a shorthand for these two commands above:",
		`${chalk.bgWhite.black(` git checkout -b ${newBranchName} `)}`,
	]);
}

export default runBranchTask;
