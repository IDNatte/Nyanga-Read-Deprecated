<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import toast, { Toaster } from 'svelte-french-toast';
	import { marked } from 'marked';
	import { _ } from 'svelte-i18n';

	import navigationStore from '$lib/store/navigation.store';
	import bookmarkStore from '$lib/store/bookmark.store';

	import WindowFrameComponent from '$lib/components/frame/WindowFrameComponent.svelte';
	import PageLoaderComponent from '$lib/components/loader/PageLoaderComponent.svelte';
	import ModalComponent from '$lib/components/modal/ModalComponent.svelte';

	import TransalateIcon from '$lib/components/icons/TransalateIcon.svelte';

	import LanguageMenuComponent from '$lib/components/menu/LanguageMenuComponent.svelte';
	import languageMenuStore from '$lib/store/languageMenu.store';
	import modalStore from '$lib/store/modal.store';
	import appStore from '$lib/store/app.store';

	import '../app.css';

	const triggerAppAbout = new CustomEvent('request:app-about');
	const triggerInstallUpdate = new CustomEvent('request:app-instal-update');
	const triggerGetLang = new CustomEvent('request:app-get-lang');
	const triggerInitRun = new CustomEvent('request:check-app');
	const triggerAppFullReload = new CustomEvent('request:app-full-reload');

	const markedOptions = {
		smartLists: true,
		smartypants: true,
		gfm: true,
		breaks: false
	};

	let currentLang: string;
	$: currentLang = convertLangCode(document.documentElement.lang);

	function convertLangCode(lang: string) {
		if (document.documentElement.lang === 'en') {
			lang = 'english';
		}

		if (document.documentElement.lang === 'id') {
			lang = 'bahasa indonesia';
		}

		return lang;
	}

	async function changeLanguage(code: string, title: string) {
		const triggerSetLang = new CustomEvent('request:app-set-lang', {
			detail: {
				code,
				title
			}
		});

		window.location.reload();
		document.dispatchEvent(triggerSetLang);
	}

	function installUpdate() {
		document.dispatchEvent(triggerInstallUpdate);
	}

	function fullReloadApp() {
		document.dispatchEvent(triggerAppFullReload);
	}

	onMount(() => {
		document.dispatchEvent(triggerAppAbout);

		document.dispatchEvent(triggerGetLang);

		document.dispatchEvent(triggerInitRun);

		document.addEventListener('manga-action:info', (event: any) => {
			toast(event.detail.info, { icon: '😸', position: 'top-right' });
		});

		document.addEventListener('manga-action:load', (event: any) => {
			bookmarkStore.set(event.detail.data);
		});

		document.addEventListener('app-action:init', (event: any) => {
			if (event.detail.reloadRequired) {
				modalStore.set({ modal: 'winreload-modal', open: true });
			}
		});

		document.addEventListener('app-action:language', async (event: any) => {
			document.documentElement.lang = event.detail.data.langCode;
			currentLang = convertLangCode(event.detail.data.langCode);
			await invalidateAll();
		});

		document.addEventListener('app-action:about', (event: any) => {
			let appInfo = JSON.parse(event.detail.data.about);
			let mdxConvert = marked.parse(appInfo, markedOptions);
			$appStore.about = mdxConvert;
			$appStore.appVersion = event.detail.data.appVersion;
		});

		document.addEventListener('app-action:update', (event: any) => {
			$appStore.update = event.detail.data;
		});
	});
</script>

<WindowFrameComponent />

{#if $navigationStore === 'loading'}
	<div out:fade={{ delay: 500 }}>
		<PageLoaderComponent />
	</div>
{/if}

<main>
	<slot />
</main>

<ModalComponent modal="about-modal" title="{$_('menu.about')} Nyanga 😸">
	<div class="prose">
		{@html $appStore.about}
	</div>
</ModalComponent>

<ModalComponent modal="update-modal" title="{$_('menu.update')} 😸">
	<div class="flex items-center justify-center flex-col">
		<div class="icon py-4 {$appStore.update?.checking ? 'animate-bounce' : ''}">
			<span class="text-9xl">😸</span>
		</div>
		<div class="app-info py-3 flex flex-col justify-center items-center">
			<span class="font-thin text-3xl capitalize">Nyanga read </span>
			<span class="py-3 text-lg capitalize"
				>{$_('menu.updateOpt.version')} {$appStore.appVersion}</span
			>
			{#if $appStore.update?.status === 'update-available'}
				<span class="py-3 text-md capitalize">{$_('menu.updateOpt.newUpAvail')}</span>
			{/if}
			{#if $appStore.update?.status === 'update-unavailable'}
				<span class="py-3 text-md capitalize">{$_('menu.updateOpt.newUpUnavail')}</span>
			{/if}
			{#if $appStore.update?.status === 'error'}
				<span class="py-3 text-md capitalize">{$_('menu.updateOpt.upError')}</span>
			{/if}
			{#if $appStore.update?.status === 'downloading'}
				<span class="py-3 text-md capitalize">{$_('menu.updateOpt.downloadUp')}</span>
			{/if}

			{#if $appStore.update?.status === 'downloaded'}
				<a href="#!" on:click|preventDefault={installUpdate}>
					<span class="py-3 text-md capitalize">{$_('menu.updateOpt.installUp')}</span>
				</a>
			{/if}
		</div>
	</div>
</ModalComponent>

<ModalComponent modal="winreload-modal" title="{$_('window.fullReload.modal.header.header')} 😸">
	<div class="flex items-center justify-center flex-col">
		<div class="icon py-4">
			<span class="text-9xl">😸</span>
		</div>
		<div class="app-info py-3 flex flex-col justify-center items-center">
			<span class="font-thin text-3xl capitalize">Nyanga read</span>
			<span class="py-3 text-lg capitalize">{$_('window.fullReload.modal.content.text1')}</span>
			<a href="#!" on:click|preventDefault={fullReloadApp}>
				<span class="py-3 text-md capitalize">{$_('window.fullReload.modal.content.button')}</span>
			</a>
		</div>
	</div>
</ModalComponent>

<ModalComponent modal="language-modal" title="{$_('menu.langSelectOpt.selector')} 🌏">
	<div class="flex items-center justify-center flex-col">
		<div class="icon py-4 ">
			<span class="text-9xl">😸</span>
		</div>
		<div class="language py-3 flex flex-col justify-center items-center">
			<LanguageMenuComponent>
				<div slot="title" class="flex items-center">
					<span class="flex items-center pr-5 capitalize">{$_('menu.langSelectOpt.selector')}</span>
					<TransalateIcon />
				</div>
				<div slot="content" class="flex flex-col divide-y text-center">
					<a
						class="py-2 px-2 center w-full"
						href="#!"
						on:click|preventDefault={() => {
							changeLanguage('id', 'bahasa indonesia');
							languageMenuStore.set(false);
						}}
					>
						<span class=" w-full inline-block">Bahasa Indonesia</span>
					</a>
					<a
						class="py-2 px-2 center w-full"
						href="#!"
						on:click|preventDefault={() => {
							changeLanguage('en', 'english');
							languageMenuStore.set(false);
						}}
					>
						<span class=" w-full inline-block">English</span>
					</a>
				</div>
			</LanguageMenuComponent>

			<span class="font-thin text-xl capitalize"
				>{$_('menu.langSelectOpt.selector')} : {currentLang}</span
			>
		</div>
	</div>
</ModalComponent>

<Toaster />
