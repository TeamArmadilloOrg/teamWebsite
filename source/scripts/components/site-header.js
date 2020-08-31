import "@/styles/components/site-header.css";

import template from "@/templates/components/site-header.html";
import faviconPath from "@/brand/favicon/favicon.ico";

window.addEventListener("DOMContentLoaded", function renderComponent() {
	document.body.insertAdjacentHTML("afterbegin", template);
	document.querySelector("#logo").setAttribute("src", faviconPath);
});
