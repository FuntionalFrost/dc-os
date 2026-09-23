<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { fiberColours, getFiberTextColor } from '$lib/data/fiberColours';
	import { Meter, useDebounce } from 'yaxa-svelte';
	import { Cable, Calculator } from '@lucide/svelte';

	let fiberNumberInput = $state<number | null>(1);
	const debouncedFiberInput = useDebounce(() => fiberNumberInput, 100);

	// Fallback protection for fiber strand inputs
	let validFiberNumber = $derived(
		debouncedFiberInput.value && debouncedFiberInput.value > 0 ? debouncedFiberInput.value : 1
	);

	let calculatedTubeIndex = $derived(Math.floor((validFiberNumber - 1) / 12));
	let calculatedFiberIndex = $derived((validFiberNumber - 1) % 12);

	let tubeColor = $derived(fiberColours[calculatedTubeIndex % 12] || 'N/A');
	let strandColor = $derived(fiberColours[calculatedFiberIndex] || 'N/A');

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

<SEO
	title="TIA-598-C Optical Fiber Indexer & Loss Budget Calculator"
	description="Instant TIA-598-C 144-strand fiber color code chart, buffer tube indexer, and optical link loss budget attenuation calculator (SMF/MMF)."
	path="/hardware"
	keywords={[
		'tia-598-c fiber color code chart',
		'fiber strand color lookup',
		'optical link loss budget calculator',
		'fiber attenuation formula db',
		'smf os2 mmf om3 om4 fiber loss',
		'mated connector loss 0.75db',
		'fusion splice loss 0.3db',
		'fiber optic technician tools'
	]}
/>

<div class="space-y-6 font-mono">
	<div class="flex items-center justify-between border-b border-base-200 pb-3">
		<div>
			<h1 class="text-2xl font-black tracking-wider text-primary uppercase">
				🧵 L1_PHYSICAL // FIBER_OPTICS
			</h1>
			<p class="mt-1 text-xs text-neutral-content">
				TIA-598-C color-code lookups and physical link budget engineering.
			</p>
		</div>
		<span class="badge badge-outline badge-sm badge-accent font-bold">OPTICAL LAYER</span>
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
						class="input-bordered text-md input input-sm input-primary h-9 font-mono font-bold"
					/>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-3">
					<div class="rounded border border-base-300 bg-base-200 p-2.5 text-center">
						<p class="mb-1.5 text-[9px] text-neutral-content uppercase">Tube (Buffer)</p>
						<div
							class="badge badge-sm w-full border-base-100 bg-base-300 py-3 font-bold shadow-xs"
							style="border-left: 3px solid {getFiberTextColor(tubeColor)};"
						>
							<span class="text-xs font-bold" style="color: {getFiberTextColor(tubeColor)};">
								📁 {tubeColor} ({calculatedTubeIndex + 1})
							</span>
						</div>
					</div>

					<div class="rounded border border-base-300 bg-base-200 p-2.5 text-center">
						<p class="mb-1.5 text-[9px] text-neutral-content uppercase">Strand (Core)</p>
						<div
							class="badge badge-sm w-full border-base-100 bg-base-300 py-3 font-bold shadow-xs"
							style="border-left: 3px solid {getFiberTextColor(strandColor)};"
						>
							<span class="text-xs font-bold" style="color: {getFiberTextColor(strandColor)};">
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
								class="select-bordered select select-xs w-full font-mono text-[11px]"
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
								class="input-bordered input input-xs w-full font-mono text-xs"
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
								class="input-bordered input input-xs w-full font-mono text-xs"
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
								class="input-bordered input input-xs w-full font-mono text-xs"
								bind:value={spliceCount}
							/>
						</div>
					</div>
				</div>

				<div
					class="mt-4 flex flex-col gap-2.5 rounded-lg border border-neutral-content/10 bg-neutral p-3 text-xs text-neutral-content"
				>
					<div class="flex items-center justify-between">
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

					<Meter
						value={calculatedLoss}
						min={0}
						max={15}
						color={calculatedLoss < 3 ? 'success' : calculatedLoss < 7 ? 'warning' : 'error'}
						size="sm"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- TIA-598-C Standard 12-Color Sequence & 144-Core Matrix Reference -->
	<div class="card border border-base-200 bg-base-100 shadow-md">
		<div class="card-body p-4">
			<div class="flex items-center justify-between border-b border-base-200 pb-2">
				<div>
					<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
						<Cable class="h-4 w-4" /> TIA-598-C Standard 12-Color Sequence Palette
					</h2>
					<p class="text-[10px] text-neutral-content">
						Standardized fiber optic color code order. Click any swatch or strand to calculate
						position.
					</p>
				</div>
				<span class="badge badge-outline badge-sm badge-accent font-bold">TIA-598-C SPEC</span>
			</div>

			<!-- 12-Color Swatch Grid -->
			<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each fiberColours as color, idx (color)}
					{@const colorHex = getFiberTextColor(color)}
					{@const isSelectedStrand = calculatedFiberIndex === idx}
					<button
						onclick={() => (fiberNumberInput = idx + 1)}
						class="flex items-center gap-2 rounded-lg border p-2 text-left font-mono text-xs transition-all hover:border-primary
						{isSelectedStrand
							? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
							: 'border-base-300 bg-base-200/60'}"
					>
						<span
							class="h-4 w-4 shrink-0 rounded-full border border-black/30 shadow-xs"
							style="background-color: {colorHex};"
						></span>
						<div class="min-w-0 flex-1">
							<span class="block text-[10px] font-bold text-neutral-content/60">#{idx + 1}</span>
							<span class="block truncate text-xs font-bold" style="color: {colorHex};">
								{color}
							</span>
						</div>
					</button>
				{/each}
			</div>

			<!-- 144-Strand Bundle Tube Breakdown -->
			<div class="mt-4 rounded-xl border border-base-300 bg-base-200/40 p-3">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-[10px] font-bold tracking-wider text-accent uppercase">
						144-Strand Cable Topology (12 Tubes × 12 Cores)
					</span>
					<span class="text-[10px] text-neutral-content/60">
						Active Selection: Strand {validFiberNumber} (Tube #{calculatedTubeIndex + 1}
						{tubeColor}, Core #{calculatedFiberIndex + 1}
						{strandColor})
					</span>
				</div>

				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{#each Array.from({ length: 12 }, (_, tIdx) => tIdx) as tIdx (tIdx)}
						{@const tColor = fiberColours[tIdx]}
						{@const tHex = getFiberTextColor(tColor)}
						{@const isCurrentTube = calculatedTubeIndex === tIdx}
						<div
							class="rounded-lg border p-2 transition-all
							{isCurrentTube
								? 'border-primary bg-primary/10 ring-1 ring-primary'
								: 'border-base-300 bg-base-300/60'}"
						>
							<div class="mb-1.5 flex items-center justify-between border-b border-base-200 pb-1">
								<span class="text-[10px] font-bold" style="color: {tHex};">
									T{tIdx + 1}: {tColor}
								</span>
								<span class="text-[9px] text-neutral-content/50">
									{tIdx * 12 + 1}-{tIdx * 12 + 12}
								</span>
							</div>

							<div class="grid grid-cols-4 gap-1">
								{#each Array.from({ length: 12 }, (_, sIdx) => sIdx) as sIdx (sIdx)}
									{@const strandNum = tIdx * 12 + sIdx + 1}
									{@const isCurrentStrand = validFiberNumber === strandNum}
									<button
										onclick={() => (fiberNumberInput = strandNum)}
										class="h-5 rounded text-[9px] font-bold transition-all
										{isCurrentStrand
											? 'bg-primary text-primary-content shadow-xs ring-1 ring-primary-content'
											: 'bg-base-100 text-neutral-content hover:bg-primary/20 hover:text-primary'}"
										title={`Strand ${strandNum}: Tube ${tColor}, Core ${fiberColours[sIdx]}`}
									>
										{strandNum}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
