<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';

	import HomeIcon from '$lib/components/icons/HomeIcon.svelte';
	import ReturnIcon from '$lib/components/icons/ReturnIcon.svelte';
	import NavigationComponent from '$lib/components/navigation/NavigationComponent.svelte';

	let previousPage: string = '/';

	afterNavigate(({ from }) => {
		let previous = from?.url.pathname;
		if (!from) previous = previousPage;

		if (previous?.split('/').length === 3) previousPage = from?.url.pathname || previousPage;
		if (previous?.split('/').length === 4) previousPage = '/';
	});
</script>

<div>
	<div class="content">
		<slot />
	</div>

	<NavigationComponent>
		<div class="divide-x flex flex-row">
			<div class="px-4 py-[0.255em]">
				<a href="#!" class="flex flex-col items-center" on:click|preventDefault={() => goto('/')}>
					<HomeIcon />
				</a>
			</div>
			<div class="px-4 py-[0.255em]">
				<a
					href="#!"
					class="flex flex-col items-center"
					on:click|preventDefault={() => goto(previousPage)}
				>
					<ReturnIcon />
				</a>
			</div>
		</div>
	</NavigationComponent>
</div>
