import "@/styles/pages/home.css";
import faviconPath from "@/brand/favicon/favicon.ico";
import twitterIconPath from "@/brand/twitter_logo.png";
import template from "@/templates/pages/home.html";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("beforeend", template);
	document.querySelector("#logo img").setAttribute("src", faviconPath);
	document.querySelector("#twitter a img").setAttribute("src", twitterIconPath);
	document.querySelector("#twitter a").setAttribute("href", "https://twitter.com/lilly_armadillo");
});
