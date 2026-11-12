import { createRobotsHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createRobotsHandler({
	config: siteConfig,
	isProduction: true
});
