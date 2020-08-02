import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";

import lillyPrompt from "./lillyPrompt.js";
import userPrompt from "./userPrompt.js";

async function createPersonalLillyConfig() {
	console.log(
		lillyPrompt([
			"Hello there!",
			`I am ${chalk.gray(
				"Lilly"
			)} - a personal assistant for Team Armadillo projects.`,
		])
	);

	function verifyTeamMemberName(inputName) {
		let teamMembers = [
			"Annerlee",
			"Brandon",
			"Marius",
			"Matt",
			"Sarah",
			"Ojo",
			"Zach",
		];

		function findTeamMember(teamMemberName) {
			const regexp = new RegExp(`^${inputName}$`, "i");

			return regexp.test(teamMemberName);
		}

		return teamMembers.some(findTeamMember);
	}

	let questionsAboutUser = [
		{
			name: "name",
			type: "input",
			prefix: lillyPrompt(),
			message: `Can you please remind me what's your ${chalk.cyan(
				"name"
			)} again?`,
			suffix: `\n${userPrompt()}`,
			validate: verifyTeamMemberName,
		},
		{
			name: "emoji",
			type: "list",
			prefix: lillyPrompt(),
			message: `Please remind me which one of these was your ${chalk.cyan(
				"emoji"
			)}?`,
			suffix: `\n${userPrompt()}`,
			choices: [
				"🌅 sunrise",
				"🚀 rocket",
				"🐢 turtle",
				"👾 space invader",
				"🌊 ocean",
				"🎨 art",
				"🌞 sun with face",
			],
		},
	];
	const { name, emoji } = await inquirer.prompt(questionsAboutUser);

	function formatName() {
		const newName = name.toLowerCase();

		return newName.charAt(0).toUpperCase() + newName.slice(1);
	}

	let personalConfig = {
		name: formatName(),
		emoji: {
			icon: emoji.split(" ")[0],
			name: emoji.split(" ")[1],
		},
	};
	let personalConfigPath = path.resolve("config", "CLI", "lilly.config.json");

	fs.writeFileSync(
		personalConfigPath,
		JSON.stringify(personalConfig, null, 2)
	);
	console.log(
		lillyPrompt(
			`From now, I will remember you by saving data about you to: ${chalk.green(
				personalConfigPath
			)}`
		)
	);

	return personalConfig;
}

export default createPersonalLillyConfig;
