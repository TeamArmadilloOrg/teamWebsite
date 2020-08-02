var path = require("path");
var yargs = require("yargs");
var chalk = require("chalk");
var webpack = require("webpack");

// yargs config
yargs
	.option("environment", {
		alias: "env",
		describe: "Specify the environment for build",
		choices: ["development", "production"],
		demandOption:
			"Please specify the environment to which you want to build binary files from th CLI directory!",
	})
	.example(
		`pnpm build:CLI ${chalk.green("development")}`,
		`Build CLI binary files from the CLI directory in ${chalk.green(
			'"development"'
		)} environment`
	)
	.version(false)
	.help().argv;

// Determine the environment set based on the flag passed to command,
// an argument after --environment or --env
const environment = yargs.argv.environment;

var directories = new (function getProjectCLIdirectoriesPaths() {
	this.root = path.join(__dirname, "..", "..");

	this.config = path.join(this.root, "config");
	this.binary = path.join(this.root, "binary");
	this.CLI = path.join(this.root, "CLI");
})();

var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var nodeExternals = require("webpack-node-externals");

var webpackConfigForCLI = {
	mode: environment,

	target: "node",
	externals: [nodeExternals()],

	entry: {
		lilly: path.join(directories.CLI, "lilly.js"),
	},

	output: {
		filename: "[name]",
		path: directories.binary,
	},

	// https://webpack.js.org/configuration/resolve/
	resolve: {
		// https://webpack.js.org/configuration/resolve/#resolvealias
		alias: {
			"@": directories.root,
		},
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						// https://webpack.js.org/loaders/babel-loader/#options
						options: {
							extends: path.join(
								directories.config,
								"CLI",
								".babelrc.js"
							),
						},
					},
				],
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin({
			// https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional
		}),

		new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
	],
};

module.exports = webpackConfigForCLI;
