<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		badge?: string;
		badgeVariant?: string;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		title,
		description,
		badge,
		badgeVariant = 'badge-accent',
		class: className = '',
		children,
		actions
	}: Props = $props();
</script>

<div
	class="flex flex-col items-start justify-between gap-3 border-b border-base-200 pb-3 sm:flex-row sm:items-center {className}"
>
	<div>
		<h1 class="text-2xl font-black tracking-wider text-primary uppercase">
			{title}
		</h1>
		<p class="mt-1 text-xs text-neutral-content">
			{description}
		</p>
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if actions}
		{@render actions()}
	{:else if badge}
		<span class="badge badge-outline badge-sm {badgeVariant} font-bold">{badge}</span>
	{/if}
</div>
