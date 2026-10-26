<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		Activity,
		BookOpen,
		Cable,
		Calculator,
		Check,
		ChevronDown,
		Cpu,
		ExternalLink,
		GitBranch,
		Layers,
		LayoutDashboard,
		Menu,
		Network,
		Palette,
		Terminal,
		X
	} from '@lucide/svelte';
	import {
		CommandPalette,
		Kbd,
		useShortcuts,
		YaxaApp,
		type CommandItem,
		type IconSource
	} from 'yaxa-svelte';
	import { siteConfig } from '../site.config';
	import type { LayoutRouteId } from './$types';
	import './layout.css';

	// Svelte 5 dynamic props destructuring
	let { children } = $props();

	let currentTheme = $state('night');
	let isDrawerOpen = $state(false);
	let isPaletteOpen = $state(false);
	let isThemeMenuOpen = $state(false);

	interface ThemeItem {
		id: string;
		label: string;
		desc: string;
		primary: string;
		accent: string;
		bg: string;
	}

	const themeOptions: ThemeItem[] = [
		{
			id: 'night',
			label: 'Night',
			desc: 'Deep Navy // Cyan',
			primary: '#38bdf8',
			accent: '#818cf8',
			bg: '#0f172a'
		},
		{
			id: 'dracula',
			label: 'Dracula',
			desc: 'Vampire // Synth',
			primary: '#bd93f9',
			accent: '#ff79c6',
			bg: '#282a36'
		},
		{
			id: 'dim',
			label: 'Dim',
			desc: 'Slate Dimmed',
			primary: '#539bf5',
			accent: '#6cb6ff',
			bg: '#22272e'
		},
		{
			id: 'nord',
			label: 'Nord',
			desc: 'Arctic Frost',
			primary: '#88c0d0',
			accent: '#81a1c1',
			bg: '#2e3440'
		},
		{
			id: 'cyberpunk',
			label: 'Cyberpunk',
			desc: 'Neon Matrix',
			primary: '#00ff66',
			accent: '#ffe600',
			bg: '#0d1117'
		}
	];

	let activeThemeObj = $derived(themeOptions.find((t) => t.id === currentTheme) || themeOptions[0]);

	function toggleTheme(theme: string) {
		currentTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		document.documentElement.classList.add('dark');
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
		const navIconMap: Record<string, IconSource> = {
			'/': LayoutDashboard,
			'/terminal': Terminal,
			'/cheat-sheet': Cpu,
			'/networking': Network,
			'/hardware': Cable,
			'/quiz': BookOpen
		};

		const navShortcutMap: Record<string, string> = {
			'/': 'D',
			'/terminal': 'T',
			'/cheat-sheet': 'C',
			'/networking': 'N',
			'/hardware': 'H',
			'/quiz': 'Q'
		};

		const navItems: CommandItem[] = (siteConfig.nav || []).map((n) => ({
			id: n.href,
			label: n.label,
			group: 'Modules',
			href: n.href,
			icon: navIconMap[n.href],
			shortcut: navShortcutMap[n.href],
			onSelect: () => {
				isPaletteOpen = false;
				goto(resolve(n.href as NonNullable<LayoutRouteId>));
			}
		}));

		const toolItems: CommandItem[] = [
			{
				id: 'subnet',
				label: 'Subnet Calculator & CIDR Math',
				description: 'Bitwise IP calculator, wildcard masks, host ranges',
				group: 'Diagnostics',
				icon: Calculator,
				shortcut: 'S',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('networking'));
				}
			},
			{
				id: 'ping-flow',
				label: 'ICMP Ping Flow Visualizer',
				description: 'Step-by-step ARP, routing, and ICMP handshake',
				group: 'Diagnostics',
				icon: Activity,
				shortcut: 'P',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('networking'));
				}
			},
			{
				id: 'fiber-indexer',
				label: 'TIA-598-C Optical Fiber Finder',
				description: 'Strand and tube color indexer up to 144 cores',
				group: 'Diagnostics',
				icon: Cable,
				shortcut: 'F',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('hardware'));
				}
			},
			{
				id: 'loss-budget',
				label: 'Optical Link Loss Budget Calculator',
				description: 'Attenuation threshold engineering (SMF/MMF)',
				group: 'Diagnostics',
				icon: Layers,
				shortcut: 'L',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('hardware'));
				}
			},
			{
				id: 'kvm-terminal',
				label: 'KVM Serial CLI Terminal',
				description: 'Interactive xterm.js diagnostic simulator',
				group: 'Diagnostics',
				icon: Terminal,
				shortcut: 'K',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('terminal'));
				}
			},
			{
				id: 'exam-study',
				label: 'CompTIA Study Mode',
				description: 'Review questions with instant explanations',
				group: 'Certification',
				icon: BookOpen,
				shortcut: 'E',
				onSelect: () => {
					isPaletteOpen = false;
					goto(resolve('quiz'));
				}
			}
		];

		const themeItems: CommandItem[] = themeOptions.map((t) => ({
			id: `theme-${t.id}`,
			label: `Switch Theme: ${t.label} (${t.desc})`,
			group: 'Theme',
			icon: Palette,
			onSelect: () => {
				isPaletteOpen = false;
				toggleTheme(t.id);
			}
		}));

		const externalItems: CommandItem[] = [
			{
				id: 'yaxa-docs',
				label: 'Yaxa UI Documentation',
				description: 'Explore Svelte 5 component suite & docs (yaxa.vercel.app)',
				group: 'External Links',
				icon: ExternalLink,
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
				icon: GitBranch,
				onSelect: () => {
					isPaletteOpen = false;
					if (siteConfig.project?.repositoryUrl) {
						window.open(siteConfig.project.repositoryUrl, '_blank', 'noopener,noreferrer');
					}
				}
			}
		];

		return [...navItems, ...toolItems, ...themeItems, ...externalItems];
	});

	onMount(() => {
		const savedTheme = localStorage.getItem('dc-theme') || 'night';
		toggleTheme(savedTheme);
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			isThemeMenuOpen = false;
			isDrawerOpen = false;
		}
	}}
/>

<YaxaApp config={siteConfig} enableDefaultSeo={false}>
	<CommandPalette
		bind:open={isPaletteOpen}
		items={commandPaletteItems}
		placeholder="Search modules, tools, diagnostics..."
	/>

	<div class="relative min-h-screen bg-base-300 font-mono text-base-content">
		<!-- Desktop Permanent Sidebar -->
		<aside
			class="hidden border-r border-base-200 bg-base-100 p-4 font-mono text-base-content lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col"
		>
			<div
				class="px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-content/70 uppercase"
			>
				MODULES
			</div>
			<ul class="flex flex-col gap-0.5">
				{#if siteConfig.nav}
					{#each siteConfig.nav as link (link.href)}
						{@const isActive = page.url.pathname === link.href}
						<li>
							<a
								href={resolve(link.href as NonNullable<LayoutRouteId>)}
								class="my-0.5 flex items-center rounded-lg px-3 py-2 text-xs transition-all {isActive
									? 'bg-primary font-bold text-primary-content'
									: 'text-base-content hover:bg-base-200'}"
							>
								{link.label}
							</a>
						</li>
					{/each}
				{/if}
			</ul>

			<!-- Sidebar Footer / Credits -->
			<div class="mt-auto border-t border-base-200 pt-3">
				<a
					href="https://yaxa.vercel.app"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-between text-[11px] text-neutral-content/50 transition-colors hover:text-primary"
				>
					<span>Fueled by Yaxa UI</span>
					<span class="text-[10px] opacity-70">↗</span>
				</a>
			</div>
		</aside>

		<!-- Mobile Drawer Slideover (Overlay) -->
		{#if isDrawerOpen}
			<!-- Backdrop dismiss button -->
			<button
				type="button"
				class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
				onclick={closeDrawer}
				aria-label="Close navigation"
				tabindex="-1"
			></button>

			<!-- Mobile Drawer Panel -->
			<aside
				class="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-base-200 bg-base-100 p-4 font-mono text-base-content shadow-2xl transition-transform duration-300 lg:hidden"
			>
				<div class="flex items-center justify-between border-b border-base-200 pb-3">
					<span class="truncate text-xs font-bold tracking-wider text-primary"
						>⚡ {siteConfig.name}</span
					>
					<button
						type="button"
						class="btn btn-ghost btn-xs h-7 w-7 p-0"
						onclick={closeDrawer}
						aria-label="Close navigation"
					>
						<X class="h-4 w-4" />
					</button>
				</div>

				<div
					class="mt-3 px-3 py-1 text-[10px] font-bold tracking-widest text-neutral-content/70 uppercase"
				>
					MODULES
				</div>
				<ul class="flex flex-col gap-0.5">
					{#if siteConfig.nav}
						{#each siteConfig.nav as link (link.href)}
							{@const isActive = page.url.pathname === link.href}
							<li>
								<a
									href={resolve(link.href as NonNullable<LayoutRouteId>)}
									onclick={closeDrawer}
									class="my-0.5 flex items-center rounded-lg px-3 py-2 text-xs transition-all {isActive
										? 'bg-primary font-bold text-primary-content'
										: 'text-base-content hover:bg-base-200'}"
								>
									{link.label}
								</a>
							</li>
						{/each}
					{/if}
				</ul>

				<!-- Sidebar Footer / Credits -->
				<div class="mt-auto border-t border-base-200 pt-3">
					<a
						href="https://yaxa.vercel.app"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center justify-between text-[11px] text-neutral-content/50 transition-colors hover:text-primary"
					>
						<span>Fueled by Yaxa UI</span>
						<span class="text-[10px] opacity-70">↗</span>
					</a>
				</div>
			</aside>
		{/if}

		<!-- Main Page Content Area (offset on desktop by lg:pl-72) -->
		<div class="flex min-h-screen flex-col lg:pl-72">
			<!-- Top Navbar -->
			<header
				class="flex h-14 items-center justify-between border-b border-base-200 bg-base-100 px-3 sm:px-4"
			>
				<div class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
					<button
						type="button"
						class="btn btn-ghost h-8 w-8 p-1.5 lg:hidden"
						aria-label="Open Navigation"
						onclick={() => (isDrawerOpen = true)}
					>
						<Menu class="h-5 w-5" />
					</button>
					<a
						href={resolve('/')}
						class="truncate text-xs font-bold tracking-wider text-primary sm:text-base md:text-xl"
					>
						⚡ {siteConfig.name}
					</a>

					<!-- Quick Search Spotlight Button -->
					<button
						class="btn btn-ghost hidden h-7 gap-2 rounded-lg border border-base-300 bg-base-200/40 px-2.5 text-xs text-neutral-content/70 hover:text-base-content sm:inline-flex"
						onclick={() => (isPaletteOpen = true)}
						aria-label="Search modules"
					>
						<span>Quick Search</span>
						<Kbd combo={['meta', 'k']} size="xs" />
					</button>
				</div>

				<!-- Theme Selection Menu (Dynamically Adapting to Active Theme) -->
				<div class="relative flex-none">
					<button
						type="button"
						class="btn btn-sm flex h-8 items-center gap-2 rounded-lg border border-base-300 bg-base-200/80 px-2.5 font-mono text-xs font-bold transition-all hover:border-primary/50 hover:bg-base-200"
						onclick={() => (isThemeMenuOpen = !isThemeMenuOpen)}
						aria-haspopup="true"
						aria-expanded={isThemeMenuOpen}
						aria-label="Select color theme"
					>
						<Palette class="h-3.5 w-3.5 text-primary" />
						<span
							class="h-2.5 w-2.5 rounded-full border border-black/30 shadow-xs"
							style="background-color: {activeThemeObj.primary};"
						></span>
						<span class="text-[11px] font-bold tracking-wider text-base-content uppercase">
							{activeThemeObj.label}
						</span>
						<ChevronDown
							class="h-3 w-3 text-neutral-content transition-transform duration-200 {isThemeMenuOpen
								? 'rotate-180'
								: ''}"
						/>
					</button>

					{#if isThemeMenuOpen}
						<!-- Click outside dismiss overlay -->
						<button
							type="button"
							class="fixed inset-0 z-40 cursor-default bg-transparent"
							onclick={() => (isThemeMenuOpen = false)}
							aria-label="Close theme menu"
							tabindex="-1"
						></button>

						<div
							class="absolute right-0 z-50 mt-2 w-60 origin-top-right rounded-xl border border-base-200 bg-base-100 p-1.5 font-mono shadow-2xl ring-1 yaxa-surface-elevated ring-black/10"
							role="menu"
						>
							<div
								class="border-b border-base-200 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-neutral-content/70 uppercase"
							>
								Theme Palettes
							</div>
							<div class="mt-1 space-y-0.5">
								{#each themeOptions as theme (theme.id)}
									{@const isSelected = currentTheme === theme.id}
									<button
										type="button"
										role="menuitem"
										class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors {isSelected
											? 'bg-primary/15 font-bold text-primary'
											: 'text-base-content hover:bg-base-200'}"
										onclick={() => {
											toggleTheme(theme.id);
											isThemeMenuOpen = false;
										}}
									>
										<div class="flex items-center gap-2.5">
											<!-- Color Preview Swatch Pill -->
											<div
												class="flex h-4.5 w-8 items-center justify-center gap-1 rounded border border-base-300 p-0.5 shadow-inner"
												style="background-color: {theme.bg};"
											>
												<span
													class="h-2 w-2 rounded-full shadow-xs"
													style="background-color: {theme.primary};"
												></span>
												<span
													class="h-2 w-2 rounded-full shadow-xs"
													style="background-color: {theme.accent};"
												></span>
											</div>
											<div class="text-left">
												<div class="text-[11px] font-bold tracking-wider uppercase">
													{theme.label}
												</div>
												<div class="text-[9px] text-neutral-content/70">{theme.desc}</div>
											</div>
										</div>
										{#if isSelected}
											<Check class="h-3.5 w-3.5 text-primary" />
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</header>

			<!-- Render Active Page -->
			<main class="mx-auto w-full max-w-7xl flex-1 p-3 sm:p-4 md:p-6">
				{@render children()}
			</main>
		</div>
	</div>
</YaxaApp>
