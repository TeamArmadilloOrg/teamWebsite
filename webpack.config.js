var yargs = require("yargs");
var path = require("path");
var fs = require("fs");

// yargs config
yargs
	.option("environment", {
		alias: "env",
		describe: "Specify the environment for build",
		choices: ["development", "testing", "production"],
		// prettier-ignore
		demandOption: "Please specify the environment to which you want to build the project from source directory!"
	})
	.example(
		"pnpm build development",
		'Build project from the source directory in "development" environment'
	)
	.version(false)
	.help().argv;

// Determine the environment set based on the flag passed to command,
// an argument after --environment or --env
const environment = yargs.argv.environment;

// webpack plugins
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var HTMLwebpackPlugin = require("html-webpack-plugin");

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
	this.scripts = path.join(this.source, "scripts");
	this.styles = path.join(this.source, "styles");
	this.templates = path.join(this.source, "templates");
})();

var webpackConfig = {
	// https://webpack.js.org/configuration/mode/
	mode: environment == "testing" ? "production" : environment,

	// https://webpack.js.org/configuration/entry-context/#context
	context: directories.source,

	// https://webpack.js.org/configuration/entry-context/#entry
	entry: {
		index: path.join(directories.scripts, "index.js"),
		...getPagesEntryPoints(),
	},

	// https://webpack.js.org/configuration/output/
	output: {
		// https://webpack.js.org/configuration/output/#outputpath
		path: directories.output,
		// https://webpack.js.org/configuration/output/#outputfilename
		filename: "assets/scripts/[name].bundle.js",
	},

	// https://webpack.js.org/configuration/resolve/
	resolve: {
		// https://webpack.js.org/configuration/resolve/#resolvealias
		alias: {
			"@": directories.source, // root directory of source
		},
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
							name: "assets/[path][name].[ext]",
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

		new HTMLwebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#options
			filename: "index.html",
			template: path.join(directories.templates, "index.html"),
			chunks: ["index"],
			inject: "head",
		}),

		...generatePagesTemplatesWithHTMLwebpackPlugin(),
	],

	// https://webpack.js.org/configuration/dev-server/#devserver
	devServer: {
		// https://webpack.js.org/configuration/dev-server/#devservercontentbase
		contentBase: directories.output,
		// https://webpack.js.org/configuration/dev-server/#devserverindex
		index: "index.html",
		// https://webpack.js.org/configuration/dev-server/#devserverlivereload
		liveReload: true,
		// https://webpack.js.org/configuration/dev-server/#devserverwatchcontentbase
		watchContentBase: true,
	},
};

function getPagesEntryPoints() {
	function convertArrayToObjectWithPaths(EntryPointFilename) {
		const entryPointBasename = path.basename(EntryPointFilename, ".js");
		const entryPointFullPath = path.join(
			directories.scripts,
			"pages",
			EntryPointFilename
		);

		return { [entryPointBasename]: entryPointFullPath };
	}

	return Object.assign(
		{},
		...fs
			.readdirSync(path.join(directories.scripts, "pages"))
			.map(convertArrayToObjectWithPaths)
	);
}

function generatePagesTemplatesWithHTMLwebpackPlugin() {
	function generatePageTemplate(templateFilename) {
		return new HTMLwebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#options
			filename: templateFilename,
			template: path.join(
				directories.templates,
				"pages",
				templateFilename
			),
			chunks: ["index", path.basename(templateFilename, ".html")],
			inject: "head",
		});
	}

	return fs
		.readdirSync(path.join(directories.templates, "pages"))
		.map(generatePageTemplate);
}

module.exports = webpackConfig;
