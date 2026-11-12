import { createSitemapXslHandler } from 'yaxa-svelte/seo';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createSitemapXslHandler({ config: siteConfig });
