import "@/styles/pages/home.css";
import faviconPath from "@/brand/favicon/favicon.ico";
import template from "@/templates/pages/home.html";
import * as Team from "@/scripts/pages/team.js";

window.addEventListener("DOMContentLoaded", function () {
	document.body.insertAdjacentHTML("beforeend", template);
	document.querySelector("#logo").setAttribute("src", faviconPath);
	addCustomEventListener();
});

function addCustomEventListener() {
	addTeamLinkNavigation();
}

function addTeamLinkNavigation() {
	document
		.querySelector("#team-link")
		.addEventListener("click", function renderTeamPage(e) {
			const main_container = document.querySelector("#main-container");
			while (main_container.firstChild) {
				main_container.removeChild(main_container.firstChild);
			}
			const teamTemplate = Team.getTemplate();
			main_container.insertAdjacentHTML("beforeend", teamTemplate);
		});
}

//Work in progress
// why does this immediately invoke the renderTeamPage function although it is just added for the
// click-event
// function addCustomEventListener(){
// 	document.querySelector("#team-link").addEventListener("click", function renderTeamPage(e){
// 	});
// }

// function renderTeamPage(){
// 	const teamTemplate = Team.getTemplate();
// 	document.querySelector("#main-container").insertAdjacentHTML("beforeend", teamTemplate);
// }
