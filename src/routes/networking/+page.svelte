<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import PingFlowVisualizer from '$lib/components/PingFlowVisualizer.svelte';
	import SubnetCalculator from '$lib/components/SubnetCalculator.svelte';
	import TransceiverDiagnostics from '$lib/components/TransceiverDiagnostics.svelte';
	import { osiLayers } from '$lib/data/osiLayers';
	import { CircleQuestionMark, Cpu, Layers, Network, Server } from '@lucide/svelte';

	let activeOsiLayer = $state(7);
	let doraStep = $state('DISCOVER');

	let selectedLayerData = $derived(osiLayers.find((l) => l.num === activeOsiLayer) || osiLayers[0]);
</script>

<SEO
	title="Network Standards & Transceiver Matrix"
	description="Bitwise IPv4 CIDR subnet calculator, 10G-400G optical transceiver specification matrix, DOM power converter, ICMP ping packet flow, and interactive OSI/DHCP visualizer."
	path="/networking"
	keywords={[
		'ipv4 cidr subnet calculator',
		'optical transceiver matrix 100g cwdm4 sr4',
		'dom optical power converter mw dbm',
		'data center service ports list',
		'ping packet flow visualizer',
		'osi 7 layer model interactive guide',
		'dhcp dora simulator udp 67 68',
		'noc network diagnostics'
	]}
/>

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
		<span class="badge badge-outline badge-sm badge-accent font-bold">NOC CONTROL</span>
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

				<div class="flex flex-col gap-1.5">
					{#each osiLayers as layer (layer.num)}
						{@const isSelected = activeOsiLayer === layer.num}
						{@const layerColor =
							layer.num >= 6
								? 'border-purple-500/40 text-purple-300'
								: layer.num >= 4
									? 'border-cyan-500/40 text-cyan-300'
									: layer.num >= 2
										? 'border-emerald-500/40 text-emerald-300'
										: 'border-amber-500/40 text-amber-300'}
						<button
							onclick={() => (activeOsiLayer = layer.num)}
							class="btn btn-xs h-9 justify-between text-left transition-all {isSelected
								? 'btn-primary font-bold text-primary-content shadow-md ring-1 ring-primary'
								: 'btn-ghost border border-base-300 bg-base-200/80 hover:border-primary/50'}"
						>
							<div class="flex items-center gap-2">
								<span
									class="flex h-5 w-5 items-center justify-center rounded border text-[10px] font-black {layerColor}"
								>
									L{layer.num}
								</span>
								<span class="font-bold">{layer.name}</span>
							</div>
							<span
								class="badge badge-xs {isSelected
									? 'badge-accent font-black'
									: 'badge-ghost text-[9px]'}">INFO</span
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
						<span
							class="rounded-md border border-primary/40 bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary"
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
							<div class="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
								<span class="text-[10px] font-bold text-cyan-400 uppercase">Key Protocols</span>
								<p class="mt-1 font-bold text-base-content">{selectedLayerData.protocols}</p>
							</div>
							<div class="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3">
								<span class="text-[10px] font-bold text-purple-400 uppercase"
									>Physical Equipment</span
								>
								<p class="mt-1 font-bold text-base-content">{selectedLayerData.hardware}</p>
							</div>
						</div>
					</div>
				</div>

				<div
					class="alert alert-warning mt-4 flex items-start gap-2 rounded-xl border-warning/20 bg-warning/10 p-3 text-xs text-warning"
				>
					<CircleQuestionMark class="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<h4 class="text-[10px] font-bold tracking-wider uppercase">
							Interview Scenario Reference
						</h4>
						<pre
							class="mt-1 rounded bg-black/40 p-2 font-mono text-[11px] leading-normal whitespace-pre-wrap text-base-content">{selectedLayerData.interviewQ}</pre>
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
				{#each [{ name: 'DISCOVER', color: 'border-amber-500/50 bg-amber-500/20 text-amber-300' }, { name: 'OFFER', color: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' }, { name: 'REQUEST', color: 'border-amber-500/50 bg-amber-500/20 text-amber-300' }, { name: 'ACK', color: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300' }] as item (item.name)}
					{@const isSelected = doraStep === item.name}
					<button
						onclick={() => (doraStep = item.name)}
						class="btn btn-xs flex-1 font-mono transition-all {isSelected
							? `${item.color} font-black shadow-sm ring-1 ring-primary`
							: 'btn-outline border-base-300 bg-base-200/50'}"
					>
						{item.name}
					</button>
				{/each}
			</div>

			<div
				class="rounded-xl border border-base-300 bg-base-200/60 p-4 text-xs text-neutral-content"
			>
				<div class="flex flex-col items-stretch justify-between gap-4 font-mono md:flex-row">
					<div
						class="w-full rounded-xl border border-cyan-500/30 bg-base-300/80 p-3 text-center md:w-1/4"
					>
						<Cpu class="mx-auto mb-1 h-6 w-6 text-cyan-400" />
						<span class="block font-bold text-base-content">Technician Laptop</span>
						<span class="text-[10px] text-cyan-400/80">MAC: 00:0a:95:9d:68:16</span>
					</div>

					<div
						class="w-full flex-1 rounded-xl border border-base-300 bg-black/50 p-3.5 text-left shadow-inner"
					>
						<div
							class="mb-2 border-b border-base-300 pb-1 text-[10px] font-bold text-accent uppercase"
						>
							{doraStep === 'DISCOVER' || doraStep === 'REQUEST'
								? '📢 LAYER 2 BROADCAST FRAME'
								: '📨 LAYER 2 UNICAST TARGET'}
						</div>

						{#if doraStep === 'DISCOVER'}
							<p class="font-bold text-amber-400">
								Source IP: 0.0.0.0:68 ➔ Destination IP: 255.255.255.255:67
							</p>
							<p class="mt-1 text-[11px] text-neutral-content">
								Action: Client broadcasts network parameter search query across local Layer 2
								segment.
							</p>
						{:else if doraStep === 'OFFER'}
							<p class="font-bold text-emerald-400">
								Source IP: 10.0.0.1:67 ➔ Destination IP: 10.0.0.150:68
							</p>
							<p class="mt-1 text-[11px] text-neutral-content">
								Action: Server offers IP 10.0.0.150, advertising Subnet Mask, Gateway, and Lease
								bounds.
							</p>
						{:else if doraStep === 'REQUEST'}
							<p class="font-bold text-amber-400">
								Source IP: 0.0.0.0:68 ➔ Destination IP: 255.255.255.255:67
							</p>
							<p class="mt-1 text-[11px] text-neutral-content">
								Action: Client broadcasts formal request accepting offered IP address 10.0.0.150.
							</p>
						{:else}
							<p class="font-bold text-emerald-400">
								Source IP: 10.0.0.1:67 ➔ Destination IP: 10.0.0.150:68
							</p>
							<p class="mt-1 text-[11px] text-neutral-content">
								Action: Server acknowledges (ACK). Client binds 10.0.0.150 to local interface
								configuration.
							</p>
						{/if}
					</div>

					<div
						class="w-full rounded-xl border border-emerald-500/30 bg-base-300/80 p-3 text-center md:w-1/4"
					>
						<Server class="mx-auto mb-1 h-6 w-6 text-emerald-400" />
						<span class="block font-bold text-base-content">DHCP Server</span>
						<span class="text-[10px] text-emerald-400/80">Gateway: 10.0.0.1</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
