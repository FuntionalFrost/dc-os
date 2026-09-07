import * as sitemap from 'super-sitemap/sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return await sitemap.response({
		origin: 'https://dc-os.pages.dev',
		defaultChangefreq: 'monthly',
		defaultPriority: 0.8,
		sort: 'alpha'
	});
};
