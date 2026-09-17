import { generateOgSvg, computeProjectBadge } from 'yaxa-svelte';
import { siteConfig } from '../../../site.config';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = () => {
	const svg = generateOgSvg({
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: 'DC-OS',
		badge: siteConfig.project ? computeProjectBadge(siteConfig.project) : 'MIT Open Source',
		tag: 'Data Center Guide',
		theme: 'dark',
		url: siteConfig.url
	});

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
		}
	});
};
