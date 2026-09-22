import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'RACK_COMMAND // DC-OS',
	title: 'RACK_COMMAND // DC-OS — All-in-One Data Center Technician Guide',
	description:
		'All-in-one diagnostic suite and reference portal for Data Center Technicians, Systems Administrators, and NOC Engineers. Subnet calculator, xterm.js terminal emulator, TIA-598-C fiber color codes, optical link loss budget calculator, CompTIA exam simulator, and more.',
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
		defaultMode: 'dark',
		primaryColor: '#6366f1'
	},
	seo: {
		titleTemplate: '%s — RACK_COMMAND // DC-OS',
		defaultOgImage: 'https://dc-os.pages.dev/og-image.png',
		twitterCard: 'summary_large_image',
		keywords: [
			'data center technician guide',
			'sysadmin cheat sheet',
			'TIA-598-C fiber color code',
			'optical link loss budget calculator',
			'SFP+ DOM optical power converter',
			'100G-CWDM4 transceiver matrix',
			'IPv4 CIDR subnet calculator',
			'xterm.js hardware simulator',
			'dmidecode smartctl ethtool nvme CLI',
			'CompTIA A+ Network+ Server+ Linux+ practice test',
			'bare metal linux troubleshooting',
			'data center operations'
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
