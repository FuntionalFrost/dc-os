<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { YaxaApp } from 'yaxa-svelte';
	import { siteConfig } from '../site.config';
	import './layout.css';

	// Svelte 5 dynamic props destructuring
	let { children } = $props();

	let currentTheme = $state('night');
	let isDrawerOpen = $state(false);

	function toggleTheme(theme: string) {
		currentTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('dc-theme', theme);
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('dc-theme') || 'night';
		toggleTheme(savedTheme);
	});
</script>

<YaxaApp config={siteConfig} enableDefaultSeo={false}>
	<div class="drawer lg:drawer-open">
		<!-- Drawer Toggle Input -->
		<input id="main-drawer" type="checkbox" bind:checked={isDrawerOpen} class="drawer-toggle" />

		<!-- Main Page Content Area -->
		<div class="drawer-content flex min-h-screen flex-col bg-base-300 font-mono text-base-content">
			<!-- Top Navbar -->
			<header class="navbar border-b border-base-200 bg-base-100 px-4">
				<div class="flex-1">
					<label for="main-drawer" class="btn btn-ghost lg:hidden" aria-label="Open Navigation">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</label>
					<a href={resolve('/')} class="text-xl font-bold tracking-wider text-primary">
						⚡ {siteConfig.name}
					</a>
				</div>

				<!-- Theme Switcher -->
				<div class="flex-none gap-2">
					<select
						class="select-bordered select select-sm font-mono"
						bind:value={currentTheme}
						onchange={() => toggleTheme(currentTheme)}
					>
						<option value="night">NIGHT</option>
						<option value="dracula">DRACULA</option>
						<option value="dim">DIM</option>
					</select>
				</div>
			</header>

			<!-- Render Active Page -->
			<main class="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">
				{@render children()}
			</main>
		</div>

		<!-- Sidebar Navigation -->
		<div class="drawer-side z-50">
			<label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
			<ul
				class="menu min-h-full w-72 border-r border-base-200 bg-base-100 p-4 font-mono text-base-content"
			>
				<li class="menu-title text-[10px] tracking-widest text-neutral-content/70 uppercase">
					MODULES
				</li>

				{#if siteConfig.nav}
					{#each siteConfig.nav as link (link.href)}
						{@const isActive = page.url.pathname === link.href}
						<li>
							<a
								href={resolve(link.href as '/')}
								onclick={closeDrawer}
								class="my-0.5 transition-all {isActive
									? 'active bg-primary font-bold text-primary-content'
									: 'hover:bg-base-200'}"
							>
								{link.label}
							</a>
						</li>
					{/each}
				{/if}
			</ul>
		</div>
	</div>
</YaxaApp>
