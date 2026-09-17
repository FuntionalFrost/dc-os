<script lang="ts">
	import { Seo, generateBreadcrumbSchema } from 'yaxa-svelte';
	import { siteConfig } from '../../site.config';

	interface Props {
		title?: string;
		description?: string;
		path?: string;
		ogImage?:
			string | { title?: string; description?: string; badge?: string; theme?: 'dark' | 'light' };
		keywords?: string[];
		structuredData?: Record<string, unknown> | Record<string, unknown>[] | null;
	}

	let {
		title,
		description,
		path = '/',
		ogImage,
		keywords,
		structuredData = null
	}: Props = $props();

	let canonical = $derived(
		path !== undefined ? `${siteConfig.url}${path.startsWith('/') ? path : '/' + path}` : undefined
	);

	let computedSchemas = $derived.by<Record<string, unknown>[]>(() => {
		const schemas: Record<string, unknown>[] = [];

		if (structuredData) {
			if (Array.isArray(structuredData)) {
				schemas.push(...structuredData);
			} else {
				schemas.push(structuredData);
			}
		}

		if (path && path !== '/' && title) {
			const breadcrumbSchema = generateBreadcrumbSchema(siteConfig, [
				{ name: 'Dashboard', url: `${siteConfig.url}/` },
				{ name: title, url: `${siteConfig.url}${path.startsWith('/') ? path : '/' + path}` }
			]);
			schemas.push(breadcrumbSchema as unknown as Record<string, unknown>);
		}

		return schemas;
	});
</script>

<Seo
	config={siteConfig}
	{title}
	{description}
	{canonical}
	{ogImage}
	{keywords}
	schema={computedSchemas.length > 0 ? computedSchemas : undefined}
/>
