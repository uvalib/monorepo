// modal menu located in page.html.twig line 68 - #main-navigation-vTEST
// hamburger menu located in page.html.twig line 102 - #openmobilemenu
// close menu located in page.html.twig line 70 - #close-nav

// document.addEventListener("DOMContentLoaded", (event) => {
// 	// OPEN
// 	document
// 		.getElementById("openmobilemenu")
// 		.addEventListener("click", (e) =>
// 			window.openDialog("main-navigation-vTEST", "openmobilemenu")
// 		);
// 	// CLOSE
// 	document.getElementById("close-nav").addEventListener("click", (e) => {
// 		console.log("foo-is-here");
// 		window.closeDialog();
// 	});
// });

document.addEventListener("DOMContentLoaded", (event) => {
	document
		.getElementById("openmobilemenu")
		.addEventListener("click", (e) =>
			window.openDialog("main-navigation-vTEST", "openmobilemenu")
		);

	const closeNav = document.getElementById("close-nav");
	closeNav.addEventListener("click", (e) => window.closeDialog(closeNav));
});
