var yargs = require("yargs");
var chalk = require("chalk");
var path = require("path");
var fs = require("fs");

// yargs config
yargs
	.option("environment", {
		alias: "env",
		describe: "Specify the environment for build",
		choices: ["development", "testing", "production"],
		demandOption:
			"Please specify the environment to which you want to build the project from source directory!",
	})
	.example(
		`pnpm build:website ${chalk.green("development")}`,
		`Build the website project from the source directory in ${chalk.green(
			'"development"'
		)} environment`
	)
	.version(false)
	.help().argv;

// Determine the environment set based on the flag passed to command,
// an argument after --environment or --env
const environment = yargs.argv.environment;

if (environment == "production") {
	throw `${chalk.bgBlue(" INFO ")} ${chalk.blue(
		"The configuration for production environment is not ready yet."
	)}`;
} else if (environment == "testing") {
	throw `${chalk.bgBlue(" INFO ")} ${chalk.blue(
		"The configuration for testing environment is not ready yet."
	)}`;
}

// webpack plugins
var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var HTMLwebpackPlugin = require("html-webpack-plugin");

// a self-invoked function to return a new object with absolute paths
// to all of the directories inside the project's folder
var directories = new (function getWebsiteDirectoriesPaths() {
	this.root = path.join(__dirname, "..", "..");
	this.config = path.join(this.root, "config");

	this.build = path.join(this.root, "build");
	this.output = path.join(
		this.build,
		environment == "production" ? "public" : environment
	);

	this.source = path.join(this.root, "source");
	this.brand = path.join(this.source, "brand");
	this.data = path.join(this.source, "data");
	this.images = path.join(this.source, "images");
	this.scripts = path.join(this.source, "scripts");
	this.styles = path.join(this.source, "styles");
	this.templates = path.join(this.source, "templates");
})();

var sharedHTMLwebpackPluginOptions = {
	// https://github.com/jantimon/html-webpack-plugin#options
	inject: "head",
	meta: {
		viewport: "width=device-width, initial-scale=1",
	},
};
var pageTitles = {
	"about-us": "About Us",
	"contact-us": "Contact Us",
	projects: "Projects",
};

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
		// https://webpack.js.org/configuration/output/#outputfilename
		filename: "assets/scripts/[name].bundle.js",
		// https://webpack.js.org/configuration/output/#outputpath
		path: directories.output,
		// https://webpack.js.org/configuration/output/#outputpublicpath
		publicPath: "",
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
				exclude: [/node_modules/, /index/],
				// https://webpack.js.org/configuration/module/#ruleinclude
				include: directories.templates,
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
				include: directories.styles,
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
				include: directories.scripts,
				use: [
					{
						loader: "babel-loader",
						// https://webpack.js.org/loaders/babel-loader/#options
						options: {
							extends: path.join(
								directories.config,
								"website",
								".babelrc.js"
							),
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif|ico)$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: "file-loader",
						// https://webpack.js.org/loaders/file-loader/#options
						options: {
							name: "[path][name].[ext]",
							outputPath: "assets/",
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
			title: "Armadillo",
			filename: "index.html",
			chunks: ["index"],
			template: path.join(directories.templates, "index.html"),
			...sharedHTMLwebpackPluginOptions,
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
		const pageName = path.basename(templateFilename, ".html");

		return new HTMLwebpackPlugin({
			// https://github.com/jantimon/html-webpack-plugin#options
			title: pageTitles[pageName],
			filename: templateFilename,
			chunks: ["index", pageName],
			template: path.join(directories.templates, "index.html"),
			...sharedHTMLwebpackPluginOptions,
		});
	}

	return fs
		.readdirSync(path.join(directories.templates, "pages"))
		.map(generatePageTemplate);
}

module.exports = webpackConfig;
