<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import './layout.css';

	// Svelte 5 dynamic props destructuring
	let { children } = $props();

	let currentTheme = $state('night');
	let drawerToggle = $state<HTMLInputElement | null>(null);

	function toggleTheme(theme: string) {
		currentTheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('dc-theme', theme);
	}

	// Close mobile sidebar drawer after tapping a link
	function closeDrawer() {
		if (drawerToggle) {
			drawerToggle.checked = false;
		}
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('dc-theme') || 'night';
		toggleTheme(savedTheme);
	});

	// Centralized Navigation Config
	const navLinks = [
		{ path: '/', label: '📟 Dashboard' },
		{ path: '/terminal', label: '🖥️ Terminal Console' },
		{ path: '/cheat-sheet', label: '💻 Host OS & Commands' },
		{ path: '/networking', label: '📡 Network Standards' },
		{ path: '/hardware', label: '🧵 Optical Fiber' },
		{ path: '/quiz', label: '🧠 Exam Training' }
	] as const;

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'RACK_COMMAND // DC-OS',
		url: 'https://dc-os.pages.dev/',
		description:
			'All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers.',
		applicationCategory: 'UtilitiesApplication, DeveloperApplication, EducationalApplication',
		operatingSystem: 'Any',
		browserRequirements: 'Requires JavaScript. Requires HTML5.',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		author: {
			'@type': 'Person',
			name: 'FuntionalFrost',
			url: 'https://github.com/FuntionalFrost'
		}
	};

	const jsonLdScript =
		'<script type="application/ld+json">' + JSON.stringify(structuredData) + '<' + '/script>';
</script>

<MetaTags
	title="Dashboard"
	titleTemplate="%s — RACK_COMMAND // DC-OS"
	description="All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers. Subnet calculator, terminal emulator, fiber optics, CompTIA exam simulator, and more."
	canonical="https://dc-os.pages.dev/"
	keywords={[
		'data center',
		'sysadmin',
		'networking',
		'linux',
		'fiber optics',
		'comptia',
		'terminal',
		'subnet calculator',
		'diagnostics'
	]}
	openGraph={{
		type: 'website',
		url: 'https://dc-os.pages.dev/',
		title: 'RACK_COMMAND // DC-OS',
		description:
			'All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers.',
		siteName: 'DC-OS',
		images: [
			{
				url: 'https://dc-os.pages.dev/og-image.png',
				width: 1200,
				height: 630,
				alt: 'RACK_COMMAND // DC-OS Preview Card',
				type: 'image/png'
			}
		]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: 'RACK_COMMAND // DC-OS',
		description:
			'All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers.',
		image: 'https://dc-os.pages.dev/og-image.png',
		imageAlt: 'RACK_COMMAND // DC-OS Preview Card'
	}}
	additionalMetaTags={[
		{ name: 'author', content: 'FuntionalFrost' },
		{ name: 'robots', content: 'index, follow' }
	]}
/>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>

<div class="drawer lg:drawer-open">
	<!-- Drawer Toggle Input -->
	<input id="main-drawer" type="checkbox" bind:this={drawerToggle} class="drawer-toggle" />

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
					⚡ RACK_COMMAND // DC-OS
				</a>
			</div>

			<!-- Theme Switcher -->
			<div class="flex-none gap-2">
				<select
					class="select-bordered select font-mono select-sm"
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

			{#each navLinks as link (link.path)}
				{@const isActive = page.url.pathname === link.path}
				<li>
					<a
						href={resolve(link.path)}
						onclick={closeDrawer}
						class="my-0.5 transition-all {isActive
							? 'active bg-primary font-bold text-primary-content'
							: 'hover:bg-base-200'}"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
