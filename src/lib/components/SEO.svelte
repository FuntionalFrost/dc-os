<script lang="ts">
	import { Seo } from 'yaxa-svelte';
	import { siteConfig } from '../../site.config';

	interface Props {
		title?: string;
		description?: string;
		path?: string;
		ogImage?: string;
		keywords?: string[];
		structuredData?: Record<string, unknown> | null;
	}

	let { title, description, path, ogImage, keywords, structuredData = null }: Props = $props();

	let canonical = $derived(
		path !== undefined ? `${siteConfig.url}${path.startsWith('/') ? path : '/' + path}` : undefined
	);
</script>

<Seo
	config={siteConfig}
	{title}
	{description}
	{canonical}
	{ogImage}
	{keywords}
	schema={structuredData ? structuredData : undefined}
/>
