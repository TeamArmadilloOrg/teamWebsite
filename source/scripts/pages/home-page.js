import "@/styles/pages/home-page.css";
import faviconPath from "@/brand/favicon/favicon.ico";

window.addEvenListener("DOMContentLoaded", function() {
     document.querySelector("#logo img").setAttribute("src", faviconPath);
});

import template from "@/templates/pages/home-page.html";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("beforeend", template);
});
