import "@/styles/components/navbar.css";

import template from "@/templates/components/navbar.html";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("afterbegin", template);

	const toggle = document.querySelector(".toggle");
	const menu = document.querySelector(".menu");

	/* Toggle mobile menu */
	function toggleMenu() {
		if (menu.classList.contains("active")) {
			menu.classList.remove("active");

			// adds the menu (hamburger) icon
			toggle.querySelector("a").innerHTML = "<i class=’fas fa-bars’></i>";
		} else {
			menu.classList.add("active");

			// adds the close (x) icon
			toggle.querySelector("a").innerHTML =
				"<i class=’fas fa-times’></i>";
		}
	}

	/* Event Listener */
	toggle.addEventListener("click", toggleMenu, false);
});
