import chalk from "chalk";
import stringLength from "string-length";
import emoji from "node-emoji";

class Prompt {
	constructor({ name, emoji, prefixStyles, textStyles, logFormat }) {
		this.name = name;
		this.emoji = emoji;
		this.prefixStyles = prefixStyles;
		this.textStyles = textStyles;
		this.logFormat = logFormat;
	}

	formatString(string, formatStyle) {
		switch (formatStyle) {
			case "uppercase": {
				return string.toUpperCase();
			}
			case "lowercase": {
				return string.toLowerCase();
			}
			case "capitalize": {
				return string.charAt(0).toUpperCase() + string.slice(1);
			}
			default:
				return string;
		}
	}

	get prefix() {
		const prefix = `${this.emoji} ${this.formatString(
			this.name,
			this.prefixStyles.textFormat
		)}`;

		return chalk[
			`bg${this.formatString(
				this.prefixStyles.backgroundColor,
				"capitalize"
			)}`
		].black(` ${prefix}: `);
	}

	get longestTextLineLength() {
		function findLongestLineOfText(currentLine, nextLine) {
			if (stringLength(currentLine) > stringLength(nextLine)) {
				return currentLine;
			} else {
				return nextLine;
			}
		}

		const longestTextLine =
			this.text.length > 0 ? this.text.reduce(findLongestLineOfText) : "";

		return stringLength(longestTextLine);
	}

	get header() {
		const prefixAstralSymbolsLength =
			this.prefix.length - stringLength(this.prefix);
		const horizontalLine = "─";
		const topLeftCorner = "┌";
		const topRightCorner = "┐";
		const prefixWithTopLines = this.prefix.padEnd(
			this.longestTextLineLength + prefixAstralSymbolsLength - 1,
			horizontalLine
		);

		return chalk[this.textStyles.color](
			`${topLeftCorner}${prefixWithTopLines}${topRightCorner}`
		);
	}

	get footer() {
		const horizontalLine = "─";
		const bottomLeftCorner = "└";
		const bottomRightCorner = "┘";

		return chalk[this.textStyles.color](
			`${bottomLeftCorner}${horizontalLine.repeat(
				this.longestTextLineLength
			)}${bottomRightCorner}`
		);
	}

	wrapTextInContainer() {
		const verticalLine = "│";
		const wrapLineOfText = (lineOfText) => {
			const astralSymbolsLength =
				lineOfText.length - stringLength(lineOfText);

			return chalk[this.textStyles.color](
				`${verticalLine}${lineOfText.padEnd(
					this.longestTextLineLength + astralSymbolsLength
				)}${verticalLine}`
			);
		};
		const joinedLinesOfText = this.text.map(wrapLineOfText).join("\n");

		return `\n${this.header}\n${joinedLinesOfText}\n${this.footer}\n`;
	}

	appendPrefixToText() {
		const addPrefixToLineOfText = (lineOfText) => {
			return `${this.prefix} ${chalk[this.textStyles.color](lineOfText)}`;
		};

		return this.text.map(addPrefixToLineOfText).join("\n");
	}

	get formattedText() {
		if (this.logFormat == "wrapped") {
			return this.wrapTextInContainer();
		} else if (this.logFormat == "prefixed") {
			return this.appendPrefixToText();
		} else {
			return this.text.join("\n");
		}
	}

	log(...text) {
		this.text = text.flat();

		console.log(this.formattedText);
	}
}

global.ErrorPrompt = new Prompt({
	name: "error",
	emoji: emoji.get("x"),
	prefixStyles: {
		backgroundColor: "red",
		textFormat: "uppercase",
	},
	textStyles: {
		color: "red",
	},
	logFormat: "wrapped",
});

global.SuccessPrompt = new Prompt({
	name: "success",
	emoji: emoji.get("heavy_check_mark"),
	prefixStyles: {
		backgroundColor: "green",
		textFormat: "uppercase",
	},
	textStyles: {
		color: "green",
	},
	logFormat: "wrapped",
});

global.WarningPrompt = new Prompt({
	name: "warning",
	emoji: emoji.get("warning"),
	prefixStyles: {
		backgroundColor: "yellow",
		textFormat: "uppercase",
	},
	textStyles: {
		color: "yellow",
	},
	logFormat: "wrapped",
});

global.InfoPrompt = new Prompt({
	name: "info",
	emoji: emoji.get("information_source"),
	prefixStyles: {
		backgroundColor: "blueBright",
		textFormat: "uppercase",
	},
	textStyles: {
		color: "blueBright",
	},
	logFormat: "wrapped",
});

global.NotePrompt = new Prompt({
	name: "note",
	emoji: emoji.get("memo"),
	prefixStyles: {
		backgroundColor: "magentaBright",
		textFormat: "uppercase",
	},
	textStyles: {
		color: "magentaBright",
	},
	logFormat: "wrapped",
});

global.LillyPrompt = new Prompt({
	name: "lilly",
	emoji: emoji.get("hedgehog"),
	prefixStyles: {
		backgroundColor: "grey",
		textFormat: "capitalize",
	},
	textStyles: {
		color: "whiteBright",
	},
	logFormat: "prefixed",
});

global.UserPrompt = new Prompt({
	name: "you",
	emoji: emoji.get("question"),
	prefixStyles: {
		backgroundColor: "cyanBright",
		textFormat: "capitalize",
	},
	textStyles: {
		color: "white",
	},
	logFormat: "prefixed",
});
