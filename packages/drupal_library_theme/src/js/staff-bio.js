if (document.querySelector("body.staff-bio")) {
	/// REPLACES THE TITLE TAG WITH H1 AND CREATES THE CUSTOM HR ELEMENT AFTER
	// select the first element with class "block-field-blocknodepersontitle"
	const titleElement = document.querySelector(
		".block-field-blocknodepersontitle"
	);

	// create a new <h1> element and replace the <div> element with it
	const newElement = document.createElement("h1");
	newElement.innerHTML = titleElement.innerHTML;
	titleElement.parentNode.replaceChild(newElement, titleElement);

	// create a new <hr> element, add the "hr--custom" class to it, and insert it after the <h1> element
	const hrElement = document.createElement("hr");
	hrElement.className = "hr--custom";
	newElement.insertAdjacentElement("afterend", hrElement);

	/// CREATES A CONTAINER FOR THE CHILD ELEMENTS
	// Select the first element with the class 'element-1'
	const element1 = document.querySelector(
		".block-field-blocknodepersonfield-uva-ldap-title"
	);

	// Create a new div element
	const div = document.createElement("div");

	// Add the 'container' class to the new div element
	div.classList.add("bio-title-container");

	// Insert the new div element before the first element
	element1.parentNode.insertBefore(div, element1);

	// Move all the elements inside the new div element
	div.appendChild(element1);

	const preferredPronouns = document.querySelector(
		".block-field-blocknodepersonfield-preferred-pronouns"
	);
	if (preferredPronouns) {
		div.appendChild(preferredPronouns);
	}

	const email = document.querySelector(
		".block-field-blocknodepersonfield-uva-ldap-email"
	);
	if (email) {
		div.appendChild(email);
	}

	const phone = document.querySelector(
		".block-field-blocknodepersonfield-uva-ldap-phone"
	);
	if (phone) {
		div.appendChild(phone);
	}

	const primaryOfficeLocation = document.querySelector(
		".block-field-blocknodepersonfield-primary-office-location"
	);
	if (primaryOfficeLocation) {
		div.appendChild(primaryOfficeLocation);
	}

	const scheduleConsultation = document.querySelector(
		".block-field-blocknodepersonfield-schedule"
	);
	if (scheduleConsultation) {
		div.appendChild(scheduleConsultation);
	}

	/// CHECK TO SEE IF THE BIO HAS AN IMAGE. IF NOT, REPLACE THE PARENT CLASS
	document.addEventListener("DOMContentLoaded", function () {
		// get the bio-head element
		const bioHead = document.querySelector(".bio-head");

		if (bioHead) {
			// check if it contains an element with the specified class
			if (!bioHead.querySelector(".block-field-blocknodepersonfield-image")) {
				// if it doesn't, replace the class
				bioHead.classList.replace("bio-head", "bio-head-no-image");
			}
		}
	});

	document.addEventListener("DOMContentLoaded", function () {
		setTimeout(function () {
			// get the bio-head element
			const bioHead = document.querySelector(".bio-head");

			if (bioHead) {
				// check if it contains an element with the specified class
				if (!bioHead.querySelector(".block-field-blocknodepersonfield-image")) {
					// if it doesn't, replace the class
					bioHead.classList.replace("bio-head", "bio-head-no-image");
				}
			}
		}, 0);
	});

	window.addEventListener("load", function () {
		const imageBlock = document.querySelector(
			".block-field-blocknodepersonfield-image"
		);
		const bioHead = document.querySelector(".bio-head");

		if (bioHead && !imageBlock) {
			const bioHeadNoImage = document.createElement("div");
			bioHeadNoImage.classList.add("bio-head-no-image");
			bioHeadNoImage.innerHTML = bioHead.innerHTML;
			bioHead.parentNode.replaceChild(bioHeadNoImage, bioHead);
		}
	});

	///   MAKES SURE THAT THE EMAIL LINK IS CLICKABLE
	// Get the element with the class "field--name-field-uva-ldap-email"
	const emailDiv = document.querySelector(".field--name-field-uva-ldap-email");

	// Get the text content of the email div
	const emailURL = emailDiv.textContent.trim();

	// Create a new anchor element
	const emailLink = document.createElement("a");

	// Set the href attribute of the anchor element to the email address
	emailLink.href = `mailto:${emailURL}`;

	// Set the text content of the anchor element to the email address
	emailLink.textContent = emailURL;

	// Replace the email div's contents with the anchor element
	emailDiv.innerHTML = "";
	emailDiv.appendChild(emailLink);

	// Add the appropriate class to change "schedule a consultation" link into a button
	document.addEventListener("DOMContentLoaded", function () {
		var consultDiv = document.querySelector(
			".block-field-blocknodepersonfield-schedule"
		);
		if (consultDiv) {
			var childLink = consultDiv.querySelector("a");
			childLink.classList.add("uvalib_link--button");
			childLink.innerHTML = "Schedule a consultation";
		}
	});
}
