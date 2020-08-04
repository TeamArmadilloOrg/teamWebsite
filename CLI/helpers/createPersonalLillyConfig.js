import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import emoji from "node-emoji";

async function createPersonalLillyConfig() {
	LillyPrompt.log([
		"Hello there!",
		`I am ${chalk.gray(
			"Lilly"
		)} - a personal assistant for Team Armadillo projects.`,
	]);

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
			name: "userName",
			type: "input",
			prefix: LillyPrompt.prefix,
			message: `Can you please remind me what's your ${chalk.cyan(
				"name"
			)} again?`,
			suffix: `\n${UserPrompt.prefix}`,
			validate: verifyTeamMemberName,
		},
		{
			name: "userEmoji",
			type: "list",
			prefix: LillyPrompt.prefix,
			message: `Please remind me which one of these was your ${chalk.cyan(
				"emoji"
			)}?`,
			suffix: `\n${UserPrompt.prefix}`,
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
	const { userName, userEmoji } = await inquirer.prompt(questionsAboutUser);

	function formatName() {
		const newName = userName.toLowerCase();

		return newName.charAt(0).toUpperCase() + newName.slice(1);
	}

	let personalConfig = {
		name: formatName(),
		emoji: emoji.get(userEmoji.split(" ")[1]),
	};
	let personalConfigPath = path.resolve("config", "CLI", "lilly.config.json");

	fs.writeFileSync(
		personalConfigPath,
		JSON.stringify(personalConfig, null, 2)
	);
	LillyPrompt.log(
		`From now, I will remember you by saving data about you to: ${chalk.green(
			personalConfigPath
		)}`
	);

	return personalConfig;
}

export default createPersonalLillyConfig;
