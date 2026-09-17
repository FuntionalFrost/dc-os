import { createSitemapHandler, type SitemapRoute } from 'yaxa-svelte';
import { siteConfig } from '../../site.config';

export const prerender = true;

const staticRoutes: SitemapRoute[] = [
	{
		loc: '/',
		priority: 1.0,
		changefreq: 'daily',
		images: [
			{
				loc: '/og-image.png',
				title: 'RACK_COMMAND // DC-OS Overview'
			}
		]
	},
	{
		loc: '/terminal',
		priority: 0.9,
		changefreq: 'weekly',
		images: [
			{
				loc: '/og-image.png',
				title: 'KVM Serial CLI Terminal Simulator'
			}
		]
	},
	{
		loc: '/networking',
		priority: 0.9,
		changefreq: 'weekly',
		images: [
			{
				loc: '/og-image.png',
				title: 'Data Center Networking & Transceiver Matrix'
			}
		]
	},
	{
		loc: '/cheat-sheet',
		priority: 0.8,
		changefreq: 'weekly',
		images: [
			{
				loc: '/og-image.png',
				title: 'Host OS & Bare Metal Diagnostics'
			}
		]
	},
	{
		loc: '/hardware',
		priority: 0.8,
		changefreq: 'weekly',
		images: [
			{
				loc: '/og-image.png',
				title: 'TIA-598-C Fiber Indexer & Link Loss Calculator'
			}
		]
	},
	{
		loc: '/quiz',
		priority: 0.8,
		changefreq: 'weekly',
		images: [
			{
				loc: '/og-image.png',
				title: 'CompTIA Certification Exam Simulator'
			}
		]
	}
];

export const GET = createSitemapHandler({
	config: siteConfig,
	staticRoutes
});
