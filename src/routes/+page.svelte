<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { resolve } from '$app/paths';
	import { ArrowRight, Cable, Cpu, Network, Shield, Terminal } from '@lucide/svelte';
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
	<div class="hero rounded-3xl border border-base-200 bg-base-100 p-6 shadow-xl md:p-10">
		<div class="hero-content max-w-4xl p-0 text-left">
			<div>
				<div class="badge badge-outline badge-primary mb-4 font-bold tracking-widest uppercase">
					SYSTEMS ONLINE // DC-OS V4
				</div>
				<h1 class="text-4xl font-black tracking-tight text-primary uppercase md:text-5xl">
					All-In-One DC Technician Guide
				</h1>
				<p class="py-4 text-sm leading-relaxed text-neutral-content md:text-base">
					Maintain bare-metal infrastructure, debug complex physical layers, calculate subnet
					boundaries, and conquer technical certification exams. Built for zero-latency execution on
					server room aisles.
				</p>
				<div class="mt-2 flex flex-wrap gap-3">
					<a href={resolve('/terminal')} class="btn btn-primary btn-sm font-mono tracking-wider">
						<Terminal class="h-4 w-4" /> LAUNCH KVM TERMINAL
					</a>
					<a href={resolve('/cheat-sheet')} class="btn btn-accent btn-sm font-mono tracking-wider">
						HOST OS SHEETS <ArrowRight class="h-4 w-4" />
					</a>
					<a
						href={resolve('/quiz')}
						class="btn btn-ghost btn-sm border-base-300 font-mono tracking-wider"
					>
						EXAM SIMULATOR
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- 5-Module Primary Portal Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Module 1: KVM Terminal -->
		<div
			class="card border border-base-200 bg-base-100 shadow-lg transition-all hover:border-primary"
		>
			<div class="card-body justify-between p-5">
				<div>
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<Terminal class="h-5 w-5" />
						</div>
						<h2 class="card-title text-sm font-black">KVM CLI TERMINAL</h2>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-neutral-content">
						Full-screen interactive `xterm.js` terminal simulator with ANSI colors, command history,
						and hardware diagnostic outputs.
					</p>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href={resolve('/terminal')} class="btn btn-outline btn-primary btn-xs font-mono"
						>OPEN CONSOLE</a
					>
				</div>
			</div>
		</div>

		<!-- Module 2: Host OS & Systems -->
		<div
			class="card border border-base-200 bg-base-100 shadow-lg transition-all hover:border-primary"
		>
			<div class="card-body justify-between p-5">
				<div>
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<Cpu class="h-5 w-5" />
						</div>
						<h2 class="card-title text-sm font-black">HOST OS & DIAGNOSTICS</h2>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-neutral-content">
						Linux boot stages, FHS directory maps, field troubleshooting scenarios, and interactive
						command generators (`tar`, `ip route`).
					</p>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href={resolve('/cheat-sheet')} class="btn btn-outline btn-accent btn-xs font-mono"
						>SYSADMIN SUITE</a
					>
				</div>
			</div>
		</div>

		<!-- Module 3: Network Operations -->
		<div
			class="card border border-base-200 bg-base-100 shadow-lg transition-all hover:border-primary"
		>
			<div class="card-body justify-between p-5">
				<div>
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<Network class="h-5 w-5" />
						</div>
						<h2 class="card-title text-sm font-black">NETWORK OPERATIONS</h2>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-neutral-content">
						Bitwise CIDR Subnet Calculator, step-by-step ICMP ping flow, SFP DOM power converters,
						and DHCP DORA handshake simulator.
					</p>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href={resolve('/networking')} class="btn btn-outline btn-accent btn-xs font-mono"
						>NOC CONTROL</a
					>
				</div>
			</div>
		</div>

		<!-- Module 4: Optical Fiber -->
		<div
			class="card border border-base-200 bg-base-100 shadow-lg transition-all hover:border-primary"
		>
			<div class="card-body justify-between p-5">
				<div>
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<Cable class="h-5 w-5" />
						</div>
						<h2 class="card-title text-sm font-black">FIBER & L1 OPTICS</h2>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-neutral-content">
						Decode 144-strand fiber core bundles using TIA-598-C color coding and calculate maximum
						allowable optical link loss budgets.
					</p>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href={resolve('/hardware')} class="btn btn-outline btn-accent btn-xs font-mono"
						>OPTICAL MATH</a
					>
				</div>
			</div>
		</div>

		<!-- Module 5: Exam Prep -->
		<div
			class="card border border-base-200 bg-base-100 shadow-lg transition-all hover:border-primary md:col-span-2 lg:col-span-1"
		>
			<div class="card-body justify-between p-5">
				<div>
					<div class="flex items-center gap-3">
						<div class="rounded-lg bg-primary/10 p-2 text-primary">
							<Shield class="h-5 w-5" />
						</div>
						<h2 class="card-title text-sm font-black">EXAM PREP SIMULATOR</h2>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-neutral-content">
						CompTIA A+, Network+, Server+, and Linux+ scenarios featuring Study Mode with
						explanations and a 15-minute Timed Exam Mode.
					</p>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href={resolve('/quiz')} class="btn btn-outline btn-accent btn-xs font-mono"
						>START EVALUATION</a
					>
				</div>
			</div>
		</div>
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
			<a
				href="https://yaxa.vercel.app"
				target="_blank"
				rel="noopener noreferrer"
				class="transition-colors hover:text-primary"
			>
				FUELED BY YAXA UI
			</a>
		</div>
	</div>
</div>
