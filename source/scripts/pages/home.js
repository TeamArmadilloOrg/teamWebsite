import "@/styles/pages/home.css";
import faviconPath from "@/brand/favicon/favicon.ico";

window.addEvenListener("DOMContentLoaded", function () {
	document.querySelector("#logo img").src = faviconPath;
});

import template from "@/templates/pages/home.html";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("beforeend", template);
});
