import "@/styles/pages/home.css";
import faviconPath from "@/brand/favicon/favicon.ico";
import template from "@/templates/pages/home.html";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("beforeend", template);
	document.querySelector("#logo").setAttribute("src", faviconPath);
});
