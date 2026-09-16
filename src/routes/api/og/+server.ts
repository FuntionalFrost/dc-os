import { createOgImageHandler } from 'yaxa-svelte';
import { siteConfig } from '../../../site.config';

export const prerender = false;

export const GET = createOgImageHandler({ config: siteConfig });
