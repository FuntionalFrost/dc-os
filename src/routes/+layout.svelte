<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { CommandPalette, Kbd, useShortcuts, YaxaApp, type CommandItem } from 'yaxa-svelte';
	import { siteConfig } from '../site.config';
	import './layout.css';

	// Svelte 5 dynamic props destructuring
	let { children } = $props();

	let currentTheme = $state('night');
	let isDrawerOpen = $state(false);
	let isPaletteOpen = $state(false);

	function toggleTheme(theme: string) {
		currentTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('dc-theme', theme);
	}

	function closeDrawer() {
		isDrawerOpen = false;
	}

	useShortcuts({
		meta_k: () => (isPaletteOpen = !isPaletteOpen),
		ctrl_k: () => (isPaletteOpen = !isPaletteOpen)
	});

	const commandPaletteItems = $derived.by<CommandItem[]>(() => {
		const navItems: CommandItem[] = (siteConfig.nav || []).map((n) => ({
			id: n.href,
			label: n.label,
			group: 'Modules',
			href: n.href,
			onSelect: () => {
				isPaletteOpen = false;
				goto(resolve(n.href as '/'));
			}
		}));

		const toolItems: CommandItem[] = [
			{
				id: 'subnet',
				label: 'Subnet Calculator & CIDR Math',
				description: 'Bitwise IP calculator, wildcard masks, host ranges',
				group: 'Diagnostics',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/networking'));
				}
			},
			{
				id: 'ping-flow',
				label: 'ICMP Ping Flow Visualizer',
				description: 'Step-by-step ARP, routing, and ICMP handshake',
				group: 'Diagnostics',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/networking'));
				}
			},
			{
				id: 'fiber-indexer',
				label: 'TIA-598-C Optical Fiber Finder',
				description: 'Strand and tube color indexer up to 144 cores',
				group: 'Diagnostics',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/hardware'));
				}
			},
			{
				id: 'loss-budget',
				label: 'Optical Link Loss Budget Calculator',
				description: 'Attenuation threshold engineering (SMF/MMF)',
				group: 'Diagnostics',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/hardware'));
				}
			},
			{
				id: 'kvm-terminal',
				label: 'KVM Serial CLI Terminal',
				description: 'Interactive xterm.js diagnostic simulator',
				group: 'Diagnostics',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/terminal'));
				}
			},
			{
				id: 'exam-study',
				label: 'CompTIA Study Mode',
				description: 'Review questions with instant explanations',
				group: 'Certification',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('/quiz'));
				}
			},
			{
				id: 'theme-night',
				label: 'Switch Theme: Night',
				group: 'Theme',
				onSelect: () => {
					isPaletteOpen = false;
					toggleTheme('night');
				}
			},
			{
				id: 'theme-dracula',
				label: 'Switch Theme: Dracula',
				group: 'Theme',
				onSelect: () => {
					isPaletteOpen = false;
					toggleTheme('dracula');
				}
			},
			{
				id: 'theme-dim',
				label: 'Switch Theme: Dim',
				group: 'Theme',
				onSelect: () => {
					isPaletteOpen = false;
					toggleTheme('dim');
				}
			},
			{
				id: 'yaxa-docs',
				label: 'Yaxa UI Documentation',
				description: 'Explore Svelte 5 component suite & docs (yaxa.vercel.app)',
				group: 'External Links',
				onSelect: () => {
					isPaletteOpen = false;
					window.open('https://yaxa.vercel.app', '_blank', 'noopener,noreferrer');
				}
			},
			{
				id: 'github-repo',
				label: 'GitHub Repository',
				description: 'Source code and open-source contributions',
				group: 'External Links',
				onSelect: () => {
					isPaletteOpen = false;
					if (siteConfig.project?.repositoryUrl) {
						window.open(siteConfig.project.repositoryUrl, '_blank', 'noopener,noreferrer');
					}
				}
			}
		];

		return [...navItems, ...toolItems];
	});

	onMount(() => {
		const savedTheme = localStorage.getItem('dc-theme') || 'night';
		toggleTheme(savedTheme);
	});
</script>

<YaxaApp config={siteConfig} enableDefaultSeo={false}>
	<CommandPalette
		bind:open={isPaletteOpen}
		items={commandPaletteItems}
		placeholder="Search modules, tools, diagnostics..."
	/>

	<div class="drawer lg:drawer-open">
		<!-- Drawer Toggle Input -->
		<input id="main-drawer" type="checkbox" bind:checked={isDrawerOpen} class="drawer-toggle" />

		<!-- Main Page Content Area -->
		<div class="drawer-content flex min-h-screen flex-col bg-base-300 font-mono text-base-content">
			<!-- Top Navbar -->
			<header class="navbar border-b border-base-200 bg-base-100 px-4">
				<div class="flex-1 items-center gap-3">
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

					<!-- Quick Search Spotlight Button -->
					<button
						class="btn btn-ghost hidden h-7 gap-2 rounded-lg border border-base-300 bg-base-200/40 px-2.5 text-xs text-neutral-content/70 hover:text-base-content sm:inline-flex"
						onclick={() => (isPaletteOpen = true)}
						aria-label="Search modules"
					>
						<span>Quick Search</span>
						<Kbd size="xs">⌘K</Kbd>
					</button>
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

				<!-- Sidebar Footer / Credits -->
				<li class="mt-auto border-t border-base-200 pt-3">
					<a
						href="https://yaxa.vercel.app"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-between text-[11px] text-neutral-content/60 transition-colors hover:text-primary"
					>
						<span>Powered by Yaxa UI</span>
						<span class="badge badge-xs badge-accent font-bold">v1.5.2</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</YaxaApp>
