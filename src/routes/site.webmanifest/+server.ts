import { createManifestHandler } from 'yaxa-svelte';
import { siteConfig } from '../../site.config';

export const prerender = true;

export const GET = createManifestHandler({ config: siteConfig });
