import "@/styles/components/site-footer.css";

import template from "@/templates/components/site-footer.html";

window.addEventListener("DOMContentLoaded", function renderComponent() {
	document.body.insertAdjacentHTML("beforeend", template);
});
