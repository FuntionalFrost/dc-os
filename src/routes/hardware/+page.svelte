<script lang="ts">
	import { fiberColours } from '$lib/data/fiberColours';
	import { Cable, Calculator } from '@lucide/svelte';

	let fiberNumberInput = $state<number | null>(1);

	// Fallback protection for fiber strand inputs
	let validFiberNumber = $derived(fiberNumberInput && fiberNumberInput > 0 ? fiberNumberInput : 1);

	let calculatedTubeIndex = $derived(Math.floor((validFiberNumber - 1) / 12));
	let calculatedFiberIndex = $derived((validFiberNumber - 1) % 12);

	let tubeColor = $derived(fiberColours[calculatedTubeIndex % 12] || 'N/A');
	let strandColor = $derived(fiberColours[calculatedFiberIndex] || 'N/A');

	/**
	 * Map TIA-598-C fiber color names to CSS-safe text colors that remain legible
	 * on dark daisyUI themes (night, dracula, dim). Black and very dark colors
	 * get a light-on-dark swatch; very light colors like White use a contrasting dark.
	 */
	function fiberTextColor(color: string): string {
		const map: Record<string, string> = {
			blue: '#60a5fa',
			orange: '#fb923c',
			green: '#4ade80',
			brown: '#d97706',
			slate: '#94a3b8',
			white: '#e2e8f0',
			red: '#f87171',
			black: '#94a3b8', // legible neutral-slate instead of true black
			yellow: '#facc15',
			violet: '#a78bfa',
			rose: '#fb7185',
			aqua: '#22d3ee'
		};
		return map[color.toLowerCase()] ?? '#e2e8f0';
	}

	// Link Budget State
	let fiberType: 'SMF' | 'MMF' = $state('SMF');
	let lengthKm = $state<number | null>(0.5);
	let connectorCount = $state<number | null>(2);
	let spliceCount = $state<number | null>(1);

	// Fallback protections for numerical inputs to prevent temporary NaN during typing
	let safeLength = $derived(lengthKm && lengthKm >= 0 ? lengthKm : 0);
	let safeConnectors = $derived(connectorCount && connectorCount >= 0 ? connectorCount : 0);
	let safeSplices = $derived(spliceCount && spliceCount >= 0 ? spliceCount : 0);

	let attenuationRate = $derived(fiberType === 'SMF' ? 0.4 : 3.0);

	// Clean optical loss budget equation: (Length * Attenuation) + (Connectors * 0.75) + (Splices * 0.3)
	let calculatedLoss = $derived(
		parseFloat(
			(safeLength * attenuationRate + safeConnectors * 0.75 + safeSplices * 0.3).toFixed(3)
		)
	);
</script>

<svelte:head>
	<title>Optical Fiber — RACK_COMMAND // DC-OS</title>
	<meta
		name="description"
		content="TIA-598-C fiber color-code lookup and optical link loss budget calculator for data center technicians."
	/>
</svelte:head>

<div class="space-y-6 font-mono">
	<div class="flex items-center justify-between border-b border-base-200 pb-2">
		<div>
			<h1 class="text-xl font-black tracking-wider text-primary uppercase">
				📡 L1_PHYSICAL // FIBER_OPTICS
			</h1>
			<p class="text-[11px] text-neutral-content">
				TIA-598-C color-code lookups and physical link budget engineering.
			</p>
		</div>
		<span class="badge badge-outline badge-sm badge-accent">OPTICAL LAYER</span>
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
		<!-- TIA-598-C Fiber Core Finder -->
		<div class="card border border-base-200 bg-base-100 shadow-md lg:col-span-5">
			<div class="card-body p-4">
				<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
					<Cable class="h-4 w-4" /> TIA-598-C Core Indexer
				</h2>
				<p class="text-[10px] text-neutral-content">
					Identify target core and tube assignments up to 144 strands.
				</p>

				<div class="form-control mt-2 w-full">
					<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase">
						Target Fiber Strand Number:
					</span>
					<input
						type="number"
						min="1"
						max="144"
						bind:value={fiberNumberInput}
						class="input-bordered text-md input h-9 font-mono font-bold input-sm input-primary"
					/>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-3">
					<div class="rounded border border-base-300 bg-base-200 p-2.5 text-center">
						<p class="mb-1.5 text-[9px] text-neutral-content uppercase">Tube (Buffer)</p>
						<div
							class="badge w-full border-base-100 bg-base-300 py-3 badge-sm font-bold shadow-xs"
							style="border-left: 3px solid {fiberTextColor(tubeColor)};"
						>
							<span class="text-xs font-bold" style="color: {fiberTextColor(tubeColor)};">
								📁 {tubeColor} ({calculatedTubeIndex + 1})
							</span>
						</div>
					</div>

					<div class="rounded border border-base-300 bg-base-200 p-2.5 text-center">
						<p class="mb-1.5 text-[9px] text-neutral-content uppercase">Strand (Core)</p>
						<div
							class="badge w-full border-base-100 bg-base-300 py-3 badge-sm font-bold shadow-xs"
							style="border-left: 3px solid {fiberTextColor(strandColor)};"
						>
							<span class="text-xs font-bold" style="color: {fiberTextColor(strandColor)};">
								🧵 {strandColor}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Optical Link Loss Calculator -->
		<div class="card border border-base-200 bg-base-100 shadow-md lg:col-span-7">
			<div class="card-body justify-between p-4">
				<div>
					<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
						<Calculator class="h-4 w-4" /> Optical Link Loss Budget
					</h2>
					<p class="mb-2 text-[10px] text-neutral-content">
						Calculate the maximum acceptable attenuation threshold for physical fiber pathways.
					</p>

					<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
						<div class="form-control">
							<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
								>Type:</span
							>
							<select
								class="select-bordered select w-full font-mono text-[11px] select-xs"
								bind:value={fiberType}
							>
								<option value="SMF">Single-Mode</option>
								<option value="MMF">Multi-Mode</option>
							</select>
						</div>
						<div class="form-control">
							<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
								>Length (km):</span
							>
							<input
								type="number"
								step="0.05"
								min="0"
								class="input-bordered input w-full font-mono text-xs input-xs"
								bind:value={lengthKm}
							/>
						</div>
						<div class="form-control">
							<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
								>Mated Pairs:</span
							>
							<input
								type="number"
								min="0"
								class="input-bordered input w-full font-mono text-xs input-xs"
								bind:value={connectorCount}
							/>
						</div>
						<div class="form-control">
							<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
								>Splices:</span
							>
							<input
								type="number"
								min="0"
								class="input-bordered input w-full font-mono text-xs input-xs"
								bind:value={spliceCount}
							/>
						</div>
					</div>
				</div>

				<div
					class="mt-4 flex items-center justify-between rounded-lg border border-neutral-content/10 bg-neutral p-3 text-xs text-neutral-content"
				>
					<div>
						<p class="text-[10px] font-bold text-neutral-content/60 uppercase">Loss Limit:</p>
						<p class="font-mono text-xl font-black text-primary">
							{calculatedLoss} <span class="text-xs font-bold">dB</span>
						</p>
					</div>
					<div class="text-right text-[10px] text-neutral-content/50">
						<p>Loss Rate: {attenuationRate} dB/km</p>
						<p>Form: (L * A) + (C * 0.75) + (S * 0.3)</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
