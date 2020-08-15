import "@/styles/pages/home.css";
import faviconPath from "@/brand/favicon/favicon.ico";
import twitterIconPath from "@/brand/twitter_logo.png";
import template from "@/templates/pages/home.html";

window.addEventListener("DOMContentLoaded", function () {
	const logoImageSelector = "#logo img";
	const twitterIconImageSelector = "#twitter a img";
	const twitterAnchorSelector = "#twitter a";
	const twitterAccountHRef = "https://twitter.com/lilly_armadillo";
	document.body.insertAdjacentHTML("beforeend", template);
	document.querySelector(logoImageSelector).setAttribute("src", faviconPath);
	document.querySelector(twitterIconImageSelector).setAttribute("src", twitterIconPath);
	document.querySelector(twitterAnchorSelector).setAttribute("href", twitterAccountHRef);
});
