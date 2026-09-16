import * as sitemap from 'super-sitemap/sveltekit';
import type { RequestHandler } from '@sveltejs/kit';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return await sitemap.response({
		origin: siteConfig.url,
		defaultChangefreq: (siteConfig.sitemap?.changefreq ?? 'weekly') as
			'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
		defaultPriority: (siteConfig.sitemap?.priority ?? 0.8) as
			0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0,
		sort: 'alpha'
	});
};
