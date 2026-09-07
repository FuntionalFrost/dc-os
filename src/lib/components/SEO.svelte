<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';

	interface Props {
		title: string;
		description: string;
		path?: string;
		ogImage?: string;
		keywords?: string[];
		structuredData?: Record<string, unknown> | null;
	}

	let {
		title,
		description,
		path = '',
		ogImage = '/og-image.png',
		keywords,
		structuredData = null
	}: Props = $props();

	const siteUrl = 'https://dc-os.pages.dev';
	const canonicalUrl = $derived(
		`${siteUrl}${path ? (path.startsWith('/') ? path : '/' + path) : '/'}`
	);
	const fullOgImage = $derived(ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`);
	const fullTitle = $derived(
		path === '' || path === '/' ? title : `${title} — RACK_COMMAND // DC-OS`
	);

	const jsonLdScript = $derived(
		structuredData
			? '<script type="application/ld+json">' + JSON.stringify(structuredData) + '<' + '/script>'
			: null
	);
</script>

<MetaTags
	{title}
	{description}
	canonical={canonicalUrl}
	{keywords}
	openGraph={{
		url: canonicalUrl,
		title: fullTitle,
		description,
		images: [
			{
				url: fullOgImage,
				width: 1200,
				height: 630,
				alt: fullTitle,
				type: 'image/png'
			}
		]
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: fullTitle,
		description,
		image: fullOgImage,
		imageAlt: fullTitle
	}}
/>

<svelte:head>
	{#if jsonLdScript}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdScript}
	{/if}
</svelte:head>
