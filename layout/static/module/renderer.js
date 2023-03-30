document.addEventListener('DOMContentLoaded', () => {
	document.addEventListener('manga-action:saveLocal', (event) => {
		window.backendAPI.triggerSave(event.detail.mangaId);
	});

	document.addEventListener('request:manga-load', () => {
		window.backendAPI.triggerMangaLoad();
	});

	document.addEventListener('request:manga-load-all', () => {
		window.backendAPI.triggerMangaLoadAll();
	});

	document.addEventListener('request:app-about', () => {
		window.backendAPI.triggerAppAbout();
	});

	document.addEventListener('request:app-update', () => {
		window.backendAPI.triggerAppUpdate();
	});

	document.addEventListener('request:app-instal-update', () => {
		window.backendAPI.triggerAppApplyUpdate();
	});

	document.addEventListener('request:win-minimize', () => {
		window.backendAPI.triggreWinMinimize();
	});

	document.addEventListener('request:win-resize', () => {
		window.backendAPI.triggerWinResize();
	});

	document.addEventListener('request:win-close', () => {
		window.backendAPI.triggreWinClose();
	});

	document.addEventListener('request:app-get-lang', () => {
		window.backendAPI.triggerAppGetLanguage();
	});

	document.addEventListener('request:app-set-lang', (event) => {
		window.backendAPI.triggerAppSetLanguage(event.detail);
		// window.backendAPI.triggerAppFullReload()
	});

	document.addEventListener('request:check-app', () => {
		window.backendAPI.triggerAppCheckInit();
	});

	document.addEventListener('request:app-full-reload', () => {
		window.backendAPI.triggerAppFullReload();
	});

	window.backendAPI.onAppCheckInit((e, data) => {
		let appInitRun = new CustomEvent('app-action:init', { detail: data });
		document.dispatchEvent(appInitRun);
	});

	window.backendAPI.onGetAppLang((e, data) => {
		let appLanguage = new CustomEvent('app-action:language', { detail: { data } });
		console.log(data)
		document.dispatchEvent(appLanguage);
	});

	window.backendAPI.onMangaSave((e, data) => {
		let mangaAction = new CustomEvent('manga-action:info', { detail: { info: data } });
		document.dispatchEvent(mangaAction);
	});

	window.backendAPI.onMangaLoad((e, data) => {
		let mangaLoad = new CustomEvent('manga-action:load', { detail: { data } });
		document.dispatchEvent(mangaLoad);
	});

	window.backendAPI.onMangaLoadAll((e, data) => {
		let mangaLoadAll = new CustomEvent('manga-action:load-all', { detail: { data } });
		document.dispatchEvent(mangaLoadAll);
	});

	window.backendAPI.onAppAbout((e, data) => {
		let appAbout = new CustomEvent('app-action:about', { detail: { data } });
		document.dispatchEvent(appAbout);
	});

	window.backendAPI.onAppUpdate((e, data) => {
		let appUpdate = new CustomEvent('app-action:update', { detail: { data } });
		document.dispatchEvent(appUpdate);
	});
});
