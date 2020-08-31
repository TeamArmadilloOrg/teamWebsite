import template from "@/templates/pages/home.html";

window.addEventListener("DOMContentLoaded", function renderPageContent() {
	document
		.getElementById("site-main")
		.insertAdjacentHTML("afterbegin", template);
});
