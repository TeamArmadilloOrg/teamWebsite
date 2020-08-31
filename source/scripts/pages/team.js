import "@/styles/pages/team.css";
import template from "@/templates/pages/team.html";

window.addEventListener("DOMContentLoaded", function renderPageContent() {
	document
		.querySelector("#site-main")
		.insertAdjacentHTML("afterbegin", template);
});
