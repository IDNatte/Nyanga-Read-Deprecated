/* eslint-disable no-undef */
window.addEventListener('pywebviewready', () => {
	pywebview.api.ready().then((response) => {
		console.log(response);
	});
});
