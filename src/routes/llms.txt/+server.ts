import { createLlmsTxtHandler } from 'yaxa-svelte/seo';
import { portalModules } from '#lib/data/modules.js';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createLlmsTxtHandler({
	config: siteConfig,
	sections: [
		{
			title: 'Diagnostic Modules',
			description:
				'Interactive client-side reference and simulation tools for data center operations.',
			links: [
				{
					title: 'Dashboard Overview',
					url: '/',
					description: 'Portal overview and quick module launcher'
				},
				...portalModules.map((mod) => ({
					title: mod.title,
					url: `/${mod.href}`,
					description: mod.description
				}))
			]
		},
		{
			title: 'Metadata & Machine-Readable Endpoints',
			links: [
				{
					title: 'XML Sitemap',
					url: '/sitemap.xml',
					description: 'Complete list of static application routes'
				},
				{
					title: 'Web App Manifest',
					url: '/site.webmanifest',
					description: 'PWA installation metadata'
				},
				{
					title: 'Source Repository',
					url: siteConfig.project?.repositoryUrl || 'https://github.com/FuntionalFrost/dc-os',
					description: 'Open-source SvelteKit codebase (MIT License)'
				}
			]
		}
	],
	notes: [
		'All diagnostic calculators, terminal simulations, and exam prep modules run 100% client-side with zero backend dependencies.',
		'Supports five dark themes: Night, Dracula, Dim, Nord, and Cyberpunk.'
	]
});
