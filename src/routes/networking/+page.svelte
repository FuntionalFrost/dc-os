<script lang="ts">
	import PingFlowVisualizer from '$lib/components/PingFlowVisualizer.svelte';
	import SubnetCalculator from '$lib/components/SubnetCalculator.svelte';
	import TransceiverDiagnostics from '$lib/components/TransceiverDiagnostics.svelte';
	import { osiLayers } from '$lib/data/osiLayers';
	import { CircleQuestionMark, Cpu, Layers, Network, Server } from '@lucide/svelte';

	let activeOsiLayer = $state(7);
	let doraStep = $state('DISCOVER');

	let selectedLayerData = $derived(osiLayers.find((l) => l.num === activeOsiLayer) || osiLayers[0]);
</script>

<svelte:head>
	<title>Network Standards — RACK_COMMAND // DC-OS</title>
	<meta
		name="description"
		content="Bitwise CIDR subnet calculator, ping protocol flow visualizer, SFP/QSFP DOM diagnostics, OSI model explorer, and DHCP DORA handshake simulator."
	/>
</svelte:head>

<div class="space-y-6 font-mono">
	<!-- Networking Route Header -->
	<div class="flex items-center justify-between border-b border-base-200 pb-3">
		<div>
			<h1 class="text-2xl font-black tracking-wider text-primary uppercase">
				📡 L2_L7_STANDARDS // NETWORKING
			</h1>
			<p class="mt-1 text-xs text-neutral-content">
				Subnet bounds, layer interactions, frame translations, transceivers, and DHCP mappings.
			</p>
		</div>
		<span class="badge badge-outline badge-sm font-bold badge-accent">NOC CONTROL</span>
	</div>

	<!-- Subnet & CIDR Mask Engine -->
	<SubnetCalculator />

	<!-- Ping Flow Anatomy -->
	<PingFlowVisualizer />

	<!-- Optical Transceivers & DOM -->
	<TransceiverDiagnostics />

	<!-- Interactive OSI Model Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="card border border-base-200 bg-base-100 shadow-xl lg:col-span-1">
			<div class="card-body p-4">
				<h2 class="card-title flex items-center gap-2 text-sm font-bold text-accent uppercase">
					<Layers class="h-4 w-4" /> Interactive OSI Model
				</h2>
				<p class="mb-3 text-xs text-neutral-content">
					Select a layer to inspect protocol bindings and physical equipment.
				</p>

				<div class="flex flex-col gap-1">
					{#each osiLayers as layer (layer.num)}
						<button
							onclick={() => (activeOsiLayer = layer.num)}
							class="btn h-9 justify-between text-left transition-all btn-xs {activeOsiLayer ===
							layer.num
								? 'font-bold text-primary-content shadow-lg btn-primary'
								: 'border border-base-300 bg-base-200 btn-ghost'}"
						>
							<span>L{layer.num} - {layer.name}</span>
							<span
								class="badge badge-xs {activeOsiLayer === layer.num
									? 'badge-accent'
									: 'badge-ghost'}">INFO</span
							>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="card border border-base-200 bg-base-100 shadow-xl lg:col-span-2">
			<div class="card-body justify-between p-4">
				<div>
					<div class="mb-3 flex items-center justify-between border-b border-base-200 pb-2">
						<h3 class="text-md font-bold tracking-wider text-primary uppercase">
							Layer {selectedLayerData.num}: {selectedLayerData.name}
						</h3>
						<span class="badge badge-outline badge-xs font-bold badge-primary"
							>L{selectedLayerData.num} SPEC</span
						>
					</div>

					<div class="space-y-3 text-xs">
						<div>
							<p class="text-[10px] font-bold text-neutral-content/60 uppercase">
								Functional Responsibility:
							</p>
							<p class="mt-1 leading-relaxed text-base-content">{selectedLayerData.desc}</p>
						</div>

						<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
								<span class="text-[10px] font-bold text-accent uppercase">Key Protocols</span>
								<p class="mt-1 font-bold text-base-content">{selectedLayerData.protocols}</p>
							</div>
							<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
								<span class="text-[10px] font-bold text-accent uppercase">Physical Equipment</span>
								<p class="mt-1 font-bold text-base-content">{selectedLayerData.hardware}</p>
							</div>
						</div>
					</div>
				</div>

				<div
					class="mt-4 alert flex items-start gap-2 rounded-lg border-warning/20 bg-warning/10 p-3 text-xs alert-warning text-warning"
				>
					<CircleQuestionMark class="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<h4 class="text-[10px] font-bold tracking-wider uppercase">
							Interview Scenario Reference
						</h4>
						<pre
							class="mt-1 rounded bg-black/30 p-2 font-mono text-[11px] leading-normal whitespace-pre-wrap text-base-content">{selectedLayerData.interviewQ}</pre>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- DHCP DORA Handshake Visualizer -->
	<div class="card border border-base-200 bg-base-100 shadow-md">
		<div class="card-body p-4">
			<h2 class="card-title flex items-center gap-2 text-sm font-bold text-accent uppercase">
				<Network class="h-4 w-4" /> DHCP State Machine: The DORA Process
			</h2>

			<div class="my-3 flex flex-col gap-2 md:flex-row">
				{#each ['DISCOVER', 'OFFER', 'REQUEST', 'ACK'] as step (step)}
					<button
						onclick={() => (doraStep = step)}
						class="btn flex-1 btn-xs {doraStep === step
							? 'font-bold text-accent-content btn-accent'
							: 'border-base-300 btn-outline'}"
					>
						{step}
					</button>
				{/each}
			</div>

			<div
				class="rounded-xl border border-neutral-content/10 bg-neutral p-4 text-xs text-neutral-content"
			>
				<div class="flex flex-col items-stretch justify-between gap-4 font-mono md:flex-row">
					<div
						class="w-full rounded-lg border border-base-200 bg-base-300 p-3 text-center md:w-1/4"
					>
						<Cpu class="mx-auto mb-1 h-6 w-6 text-primary" />
						<span class="block font-bold">Technician Laptop</span>
						<span class="text-[10px] text-neutral-content/60">MAC: 00:0a:95:9d:68:16</span>
					</div>

					<div class="w-full flex-1 rounded bg-black/40 p-3 text-left">
						<div class="divider my-0 pb-2 text-[10px] font-bold text-accent uppercase">
							{doraStep === 'DISCOVER' || doraStep === 'REQUEST'
								? '📢 BROADCAST FRAME'
								: '📨 UNICAST TARGET'}
						</div>

						{#if doraStep === 'DISCOVER'}
							<p class="font-bold text-warning">
								Source IP: 0.0.0.0:68 ➔ Destination IP: 255.255.255.255:67
							</p>
							<p class="mt-1 text-[11px] text-neutral-content/80">
								Action: Client broadcasts network parameter search query across local Layer 2
								segment.
							</p>
						{:else if doraStep === 'OFFER'}
							<p class="font-bold text-success">
								Source IP: 10.0.0.1:67 ➔ Destination IP: 10.0.0.150:68
							</p>
							<p class="mt-1 text-[11px] text-neutral-content/80">
								Action: Server offers IP 10.0.0.150, advertising Subnet Mask, Gateway, and Lease
								bounds.
							</p>
						{:else if doraStep === 'REQUEST'}
							<p class="font-bold text-warning">
								Source IP: 0.0.0.0:68 ➔ Destination IP: 255.255.255.255:67
							</p>
							<p class="mt-1 text-[11px] text-neutral-content/80">
								Action: Client broadcasts formal request accepting offered IP address 10.0.0.150.
							</p>
						{:else}
							<p class="font-bold text-success">
								Source IP: 10.0.0.1:67 ➔ Destination IP: 10.0.0.150:68
							</p>
							<p class="mt-1 text-[11px] text-neutral-content/80">
								Action: Server acknowledges (ACK). Client binds 10.0.0.150 to local interface
								configuration.
							</p>
						{/if}
					</div>

					<div
						class="w-full rounded-lg border border-base-200 bg-base-300 p-3 text-center md:w-1/4"
					>
						<Server class="mx-auto mb-1 h-6 w-6 text-accent" />
						<span class="block font-bold">DHCP Server</span>
						<span class="text-[10px] text-neutral-content/60">Gateway: 10.0.0.1</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
