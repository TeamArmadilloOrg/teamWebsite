import "@/styles/components/site-main.css";

import template from "@/templates/components/site-main.html";

window.addEventListener("DOMContentLoaded", function renderComponent() {
	document.body.insertAdjacentHTML("beforeend", template);
});
