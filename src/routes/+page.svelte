<script lang="ts">
	import SEO from '#lib/components/SEO.svelte';
	import { portalModules } from '#lib/data/modules.js';
	import { resolve } from '$app/paths';
	import { ArrowRight, Terminal } from '@lucide/svelte';
	import { generateSoftwareApplicationSchema, generateWebSiteSchema } from 'yaxa-svelte';
	import { siteConfig } from '../site.config';

	const rootSchemas = [
		generateWebSiteSchema(siteConfig),
		generateSoftwareApplicationSchema(siteConfig)
	];
</script>

<SEO
	title="All-in-One Data Center Technician Guide & Diagnostic Portal"
	description="Zero-latency diagnostic suite for Data Center Technicians, Systems Administrators, and NOC Engineers. IPv4 CIDR subnet calculator, KVM terminal emulator, TIA-598-C fiber optics indexer, and CompTIA exam simulator."
	path="/"
	keywords={[
		'data center technician guide',
		'data center diagnostics',
		'sysadmin toolkit',
		'optical fiber color code',
		'subnet calculator',
		'xterm.js linux terminal emulator',
		'CompTIA Server+ practice exam',
		'optical link loss calculator'
	]}
	structuredData={rootSchemas as unknown as Record<string, unknown>[]}
/>

<div class="space-y-8 font-mono">
	<!-- Hero Banner -->
	<div
		class="hero rounded-3xl border border-base-200 bg-base-100 yaxa-mesh-glow p-6 shadow-xl yaxa-surface-elevated md:p-10"
	>
		<div class="hero-content max-w-4xl p-0 text-left">
			<div>
				<h1 class="text-4xl font-black tracking-tight text-primary uppercase md:text-5xl">
					All-In-One DC Technician Guide
				</h1>
				<p class="py-4 text-sm leading-relaxed text-neutral-content md:text-base">
					Maintain bare-metal infrastructure, debug complex physical layers, calculate subnet
					boundaries, and conquer technical certification exams. Built for zero-latency execution on
					server room aisles.
				</p>
				<div class="mt-2 flex flex-wrap gap-3">
					<a href={resolve('terminal')} class="btn btn-primary btn-sm font-mono tracking-wider"
						><Terminal class="h-4 w-4" />LAUNCH KVM TERMINAL</a
					>

					<a href={resolve('cheat-sheet')} class="btn btn-accent btn-sm font-mono tracking-wider"
						>HOST OS SHEETS <ArrowRight class="h-4 w-4" /></a
					>

					<a
						href={resolve('quiz')}
						class="btn btn-ghost btn-sm border border-base-300 font-mono tracking-wider"
					>
						EXAM SIMULATOR
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- 5-Module Primary Portal Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each portalModules as mod (mod.id)}
			{@const Icon = mod.icon}
			<div
				class="card border bg-base-100/90 shadow-lg transition-all {mod.borderClass} {mod.colSpanClass ??
					''}"
			>
				<div class="card-body justify-between p-5">
					<div>
						<div class="flex items-center gap-3">
							<div class="rounded-lg p-2.5 shadow-inner {mod.iconBgClass}">
								<Icon class="h-5 w-5" />
							</div>
							<h2 class="card-title text-sm font-black {mod.textClass}">{mod.title}</h2>
						</div>
						<p class="mt-2 text-xs leading-relaxed text-neutral-content">
							{mod.description}
						</p>
					</div>
					<div class="card-actions mt-4 justify-end">
						<a href={resolve(mod.href)} class={mod.btnClass}>
							<Icon class="h-3 w-3" />
							{mod.buttonText}
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Operational Status Footer Bar -->
	<div
		class="alert-neutral alert flex flex-col justify-between gap-4 rounded-2xl border border-base-200 bg-base-100 p-4 text-xs md:flex-row"
	>
		<div class="flex items-center gap-2 font-bold text-success">
			<span class="relative flex h-3.5 w-3.5">
				<span
					class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"
				></span>
				<span class="relative inline-flex h-3.5 w-3.5 rounded-full bg-success"></span>
			</span>
			<span>INFRASTRUCTURE DIAGNOSTIC SYSTEMS FUNCTIONAL</span>
		</div>
		<div class="flex flex-wrap items-center gap-4 text-neutral-content/60">
			<span>ENVIRONMENT: LOCALHOST / PWA</span>
			<span>UPTIME: 99.999%</span>
			<span class="badge badge-outline badge-xs badge-success font-bold">READY</span>
		</div>
	</div>
</div>
