module.exports = {
	globals: {
		personalLillyConfig: "readonly",
		ErrorPrompt: "writable",
		WarningPrompt: "writable",
		SuccessPrompt: "writable",
		InfoPrompt: "writable",
		NotePrompt: "writable",
		LillyPrompt: "writable",
		UserPrompt: "writable",
	},

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
		indent: [
			"warn",
			"tab",
			{
				SwitchCase: 1,
			},
		],
		"max-len": [
			"error",
			{
				code: 100,
				tabWidth: 4,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			},
		],
		"linebreak-style": ["error", "unix"],
		quotes: ["warn", "double", { avoidEscape: true }],
		semi: ["error", "always"],
	},
};
