// This toggle is currently used on the "hours" page

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
	// Check if both .list-view and .grid-view elements exist
	var listView = document.querySelector(".list-view");
	var gridView = document.querySelector(".grid-view");

	if (listView && gridView) {
		// Get the checkbox input element
		var checkbox = document.querySelector(
			'.toggleSwitch input[type="checkbox"]'
		);
		// Get the toggle button element
		var toggleButton = document.querySelector(".toggleSwitch a");

		// Set the initial state (grid-view active, list-view hidden)
		listView.style.display = "block";
		gridView.style.display = "none";

		// Function to handle the toggle state
		function toggleState() {
			if (checkbox.checked) {
				// Hours selected, show list-view and hide grid-view
				listView.style.display = "block";
				gridView.style.display = "none";
				toggleButton.setAttribute("aria-pressed", "true");
			} else {
				// Location selected, show grid-view and hide list-view
				listView.style.display = "none";
				gridView.style.display = "block";
				toggleButton.setAttribute("aria-pressed", "false");
			}
		}

		// Add an event listener for the change event on the checkbox
		checkbox.addEventListener("change", toggleState);

		// Add an event listener for the click event on the toggle button
		toggleButton.addEventListener("click", function () {
			checkbox.checked = !checkbox.checked;
			toggleState();
		});

		// Add keyboard support for the toggle button
		toggleButton.addEventListener("keydown", function (event) {
			if (event.code === "Enter" || event.code === "Space") {
				checkbox.checked = !checkbox.checked;
				toggleState();
			}
		});
	}
});

// SIDEBAR HR CUSTOM ADD
// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
	// Check if the class ".layout__region--second" is present on the page
	if (document.querySelector(".layout__region--second")) {
		// Find the first <h4> tag on the page
		var firstH4 = document.querySelector("h4");

		if (firstH4) {
			// Create the <hr> element
			var hrElement = document.createElement("hr");
			hrElement.className = "hr--custom sidebar";
			hrElement.setAttribute("aria-hidden", "true"); // Add aria-hidden attribute

			// Insert the <hr> element after the closing </h4> tag
			firstH4.insertAdjacentElement("afterend", hrElement);
		}
	}
});
