<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { truncate } from 'lodash';
	import { _ } from 'svelte-i18n';

	import CardComponent from '$lib/components/card/CardComponent.svelte';
	import ImageLoader from '$lib/components/image/ImageLoader.svelte';
	import dailyEphemeralStore from '$lib/store/daily.ephemeral.store';

	let initLimit: number = 9;
	let perPage: number = 3;
	let offset: number = 0;
	let limit: number = 3;

	let endObserver: HTMLDivElement;

	const observer = new IntersectionObserver(
		(event) => {
			if (event[0].intersectionRatio > 0.2) {
				limit = perPage;
				$dailyEphemeralStore.limit = limit;

				if ($dailyEphemeralStore.data.length <= 9) {
					offset = limit + initLimit;
					$dailyEphemeralStore.offset = offset;
				} else {
					offset = $dailyEphemeralStore.offset + perPage;
					$dailyEphemeralStore.offset = offset;
				}
				getManga($dailyEphemeralStore.offset, $dailyEphemeralStore.limit);
			}
		},
		{
			root: null,
			rootMargin: '0px',
			threshold: 0.2
		}
	);

	function scrollEphemeral() {
		let lastScrollPosition = window.scrollY;
		$dailyEphemeralStore.scrollPos = lastScrollPosition;
	}

	async function getInitManga() {
		let mangaData = await fetch(
			`https://api.mangadex.org/manga?limit=9&offset=0&originalLanguage[]=ja&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&includes[]=cover_art&availableTranslatedLanguage[]=${document.documentElement.lang}`
		);
		if (mangaData.status === 200) {
			let manga = await mangaData.json();
			$dailyEphemeralStore.data = manga.data;
		} else {
			throw new Error('Something went wrong :/');
		}
	}

	async function getManga(offset: number, limit: number) {
		let mangaData = await fetch(
			`https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&originalLanguage[]=ja&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30&includes[]=cover_art&availableTranslatedLanguage[]=${document.documentElement.lang}`
		);

		if (mangaData.status === 200) {
			let manga = await mangaData.json();
			let data = $dailyEphemeralStore.data;
			$dailyEphemeralStore.data = [...data, ...manga.data];
		} else {
			throw new Error('Something went wrong :/');
		}
	}

	onMount(async () => {
		let scrollPos: number = $dailyEphemeralStore.scrollPos;

		if ($dailyEphemeralStore.data.length === 0) {
			await getInitManga();
		}

		setTimeout(() => {
			window.scrollTo({ top: scrollPos, left: 0, behavior: 'smooth' });
		}, 1500);

		observer.observe(endObserver);
	});

	onDestroy(() => {
		observer.unobserve(endObserver);
	});
</script>

<svelte:window on:scroll={scrollEphemeral} />

<div in:fade={{ duration: 200 }}>
	<div class="content grid grid-cols-3 pt-[2.2rem]" on:scroll={scrollEphemeral}>
		{#each $dailyEphemeralStore.data as { id, attributes, relationships }}
			<CardComponent>
				<a href="/read/{id}">
					{#each relationships as rel}
						{#if rel.type === 'cover_art'}
							<ImageLoader
								src={`https://uploads.mangadex.org/covers/${id}/${rel.attributes.fileName}`}
								alt={attributes.title.en}
							/>
						{/if}
					{/each}
					<div class="title text-center text-xs p-2">
						<div class="w-full">
							{truncate(attributes.title.en || attributes.title.ja, { length: 20 })}
						</div>
						<div class="w-full">
							{#if attributes.altTitles.length > 1}
								({#each attributes.altTitles as title}
									{#if title.ja}
										<span>{truncate(title.ja, { length: 20 })}</span>
									{/if}
								{/each})
							{/if}
						</div>
					</div>
				</a>
			</CardComponent>
		{/each}
	</div>
	<div
		class="loader w-full h-10 bg-pink-700 text-white flex items-center justify-center"
		bind:this={endObserver}
	>
		<span>{$_('loading.dataLoading')}</span>
	</div>
</div>
