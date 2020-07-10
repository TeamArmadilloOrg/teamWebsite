var yargs = require("yargs");
var path = require("path");

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

class Directories {
	constructor() {
		this.build = path.join(__dirname, "build");
		this.output = path.join(
			this.build,
			environment == "production" ? "public" : environment
		);

		this.source = path.join(__dirname, "source");
		this.brand = path.join(this.source, "brand");
		this.data = path.join(this.source, "data");
		this.images = path.join(this.source, "images");
		this.pages = path.join(this.source, "pages");
		this.scripts = path.join(this.source, "scripts");
		this.styles = path.join(this.source, "styles");

		this.entryPoint = path.join(this.scripts, "app.js");
	}
}

var directories = new Directories();

var webpackConfig = {
	mode: environment == "testing" ? "production" : environment,
	entry: directories.entryPoint,

	output: {
		path: directories.output,
		filename: "app.bundle.js",
	},
};

module.exports = webpackConfig;
