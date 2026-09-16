import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'RACK_COMMAND // DC-OS',
	title: 'RACK_COMMAND // DC-OS — All-in-One Data Center Technician Guide',
	description:
		'All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers. Subnet calculator, terminal emulator, fiber optics, CompTIA exam simulator, and more.',
	url: 'https://dc-os.pages.dev',
	email: 'funtionalfrost@gmail.com',
	author: {
		name: 'FuntionalFrost',
		url: 'https://github.com/FuntionalFrost',
		github: 'https://github.com/FuntionalFrost'
	},
	project: {
		license: 'MIT',
		type: 'open-source',
		pricingModel: 'open-source',
		repositoryUrl: 'https://github.com/FuntionalFrost/dc-os',
		isAccessibleForFree: true,
		badge: 'MIT Open Source'
	},
	theme: {
		defaultMode: 'dark'
	},
	seo: {
		titleTemplate: '%s — RACK_COMMAND // DC-OS',
		defaultOgImage: '/og-image.png',
		twitterCard: 'summary_large_image',
		keywords: [
			'data center',
			'sysadmin',
			'networking',
			'linux',
			'fiber optics',
			'comptia',
			'terminal',
			'subnet calculator',
			'diagnostics'
		],
		robots: {
			index: true,
			follow: true
		}
	},
	sitemap: {
		changefreq: 'weekly',
		priority: 0.8
	},
	nav: [
		{ label: '📟 Dashboard', href: '/' },
		{ label: '🖥️ Terminal Console', href: '/terminal' },
		{ label: '💻 Host OS & Commands', href: '/cheat-sheet' },
		{ label: '📡 Network Standards', href: '/networking' },
		{ label: '🧵 Optical Fiber', href: '/hardware' },
		{ label: '🧠 Exam Training', href: '/quiz' }
	],
	socials: {
		github: 'https://github.com/FuntionalFrost/dc-os'
	}
});
