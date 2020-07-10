const yargs = require("yargs");

yargs
	.option("environment", {
		alias: "env",
		describe: "Specify the environment for build",
		choices: ["development", "testing", "production"],
		// prettier-ignore
		demandOption: "Please specify the environment to which you want to build the project from source directory!"
	})
	.example([
		["npm run build development", "Using npm"],
		["yarn build development", "Using yarn"],
		["pnpm build development", "Using pnpm"],
	])
	.version(false)
	.help().argv;

const environment = yargs.argv.environment;

module.exports = {};
