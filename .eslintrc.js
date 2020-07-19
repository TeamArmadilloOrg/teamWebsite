module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 11,
		sourceType: "module",
	},
	rules: {
		indent: ["warn", "tab"],
		"max-len": ["error", { code: 100, tabWidth: 4, ignoreStrings: true }],
		"linebreak-style": ["error", "unix"],
		quotes: ["warn", "double", { avoidEscape: true }],
		semi: ["error", "always"],
	},
};
