<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	import { AlertTriangle, Home, Terminal } from '@lucide/svelte';
</script>

<SEO
	title={`Error ${page.status}`}
	description="System telemetry error - route or resource not found."
/>

<div class="flex min-h-[65vh] flex-col items-center justify-center text-center font-mono">
	<div class="card w-full max-w-xl border border-error/30 bg-base-100 p-6 shadow-2xl md:p-8">
		<!-- Status Header Badge -->
		<div class="mb-6 flex justify-center">
			<div class="badge gap-2 font-bold tracking-widest uppercase badge-error">
				<AlertTriangle class="h-3.5 w-3.5" />
				SYSTEM FAULT // STATUS {page.status}
			</div>
		</div>

		<!-- Error Title -->
		<h1 class="text-3xl font-black tracking-wider text-error md:text-4xl">
			{page.status === 404 ? 'ERR_ROUTE_NOT_FOUND' : 'ERR_SYSTEM_FAULT'}
		</h1>

		<!-- Diagnostic Console Box -->
		<div class="my-6 rounded-xl border border-base-300 bg-base-300/60 p-4 text-left text-xs">
			<div
				class="flex items-center justify-between border-b border-base-200 pb-2 text-neutral-content/60"
			>
				<span>DIAGNOSTIC_TRACE</span>
				<span>SYS_CODE: {page.status}</span>
			</div>
			<div class="mt-3 space-y-1.5 text-neutral-content">
				<p>
					<span class="font-bold text-error">&gt; FAULT:</span>
					{page.error?.message || 'The requested telemetry path is inaccessible or does not exist.'}
				</p>
				<p class="text-neutral-content/60">
					<span class="font-bold text-primary">&gt; TARGET:</span>
					{page.url.pathname}
				</p>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex flex-wrap justify-center gap-3">
			<a href={resolve('/')} class="btn font-mono btn-primary btn-sm">
				<Home class="h-4 w-4" /> DASHBOARD
			</a>
			<a href={resolve('/terminal')} class="btn btn-outline font-mono btn-primary btn-sm">
				<Terminal class="h-4 w-4" /> KVM TERMINAL
			</a>
		</div>
	</div>
</div>
