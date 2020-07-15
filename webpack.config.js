var yargs = require("yargs");
var path = require("path");

// yargs config
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

// Determine the environment set based on the flag passed to command,
// an argument after --environment or --env
const environment = yargs.argv.environment;

// a self-invoked function to return a new object with absolute paths
// to all of the directories inside the project's folder
var directories = new (function Directories() {
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
})();

// webpack plugins
var HTMLwebpackPlugin = require("html-webpack-plugin");

// webpack config
var webpackConfig = {
	// https://webpack.js.org/configuration/mode/
	mode: environment == "testing" ? "production" : environment,

	// https://webpack.js.org/configuration/entry-context/#context
	context: directories.source,

	// https://webpack.js.org/configuration/entry-context/#entry
	entry: directories.entryPoint,

	// https://webpack.js.org/configuration/output/
	output: {
		// https://webpack.js.org/configuration/output/#outputpath
		path: directories.output,
		// https://webpack.js.org/configuration/output/#outputfilename
		filename: "[name].bundle.js",
	},

	// https://webpack.js.org/configuration/module/
	module: {
		// https://webpack.js.org/configuration/module/#nested-rules
		rules: [
			{
				// https://webpack.js.org/configuration/module/#ruletest
				test: /\.html$/,
				// https://webpack.js.org/configuration/module/#ruleexclude
				exclude: /node_modules/,
				// https://webpack.js.org/configuration/module/#ruleuse
				use: [
					{
						loader: "html-loader",
						// https://webpack.js.org/loaders/html-loader/#options
						options: {
							attributes: true,
							minimize: environment != "development",
						},
					},
				],
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "style-loader",
						// https://webpack.js.org/loaders/style-loader/#options
						// options: {},
					},
					{
						loader: "css-loader",
						// https://webpack.js.org/loaders/css-loader/#options
						// options: {},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						// https://webpack.js.org/loaders/babel-loader/#options
						// options: {}.
					},
				],
			},
			{
				test: /\.(png|jpe?g)$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: "file-loader",
						// https://webpack.js.org/loaders/file-loader/#options
						options: {
							name: "[path][name].[ext]",
						},
					},
				],
			},
		],
	},

	plugins: [
		new HTMLwebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#options
			filename: "index.html",
			template: path.join(directories.source, "index.html"),
		}),
	],
};

module.exports = webpackConfig;
