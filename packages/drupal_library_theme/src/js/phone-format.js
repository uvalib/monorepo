//
[...document.querySelectorAll(".phone > a")].forEach((phoneLink) => {
	phoneLink.innerText = phoneLink.text.replace(
		/(\d\d\d)(\d\d\d)(\d\d\d\d)/,
		"($1) $2-$3"
	);
});

[
	...document.querySelectorAll(
		".field--name-field-uva-ldap-phone > .field__item > a"
	),
].forEach((phoneLink) => {
	phoneLink.innerText = phoneLink.text.replace(
		/(\d\d\d)(\d\d\d)(\d\d\d\d)/,
		"($1) $2-$3"
	);
});
