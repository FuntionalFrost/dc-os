<script lang="ts">
	import { Radio } from '@lucide/svelte';

	let formFactor = $state<'SFP+' | 'QSFP28' | 'QSFP-DD'>('SFP+');
	let inputMilliwatts = $state(0.38); // 0.380 mW default

	// Calculate Optical Power converting Milliwatts (mW) to Decibel-Milliwatts (dBm)
	// Formula: $$dBm = 10 \cdot \log_{10}(P_{\text{mW}})$$
	let calculatedDbm = $derived.by(() => {
		if (inputMilliwatts <= 0) return '-∞';
		const dbm = 10 * Math.log10(inputMilliwatts);
		return dbm.toFixed(2);
	});

	// Evaluate optical power status thresholds
	let opticalStatus = $derived.by(() => {
		const dbmVal = parseFloat(calculatedDbm);
		if (isNaN(dbmVal)) return { label: 'NO SIGNAL', color: 'text-error' };
		if (dbmVal >= -2.0 && dbmVal <= 0.5)
			return { label: 'EXCELLENT (OPTIMAL LAUNCH)', color: 'text-success' };
		if (dbmVal >= -9.5 && dbmVal < -2.0)
			return { label: 'GOOD (STANDARD OPERATIONAL)', color: 'text-success' };
		if (dbmVal >= -14.0 && dbmVal < -9.5)
			return { label: 'WARN (MARGINAL ATTENUATION)', color: 'text-warning' };
		return { label: 'CRITICAL FAIL (HIGH DIRT / LOSS)', color: 'text-error' };
	});

	const formFactorSpecs = {
		'SFP+': {
			speed: '10 Gbps',
			lanes: '1 Channel',
			optics: '850nm (SR) / 1310nm (LR)',
			connector: 'LC Duplex'
		},
		QSFP28: {
			speed: '100 Gbps',
			lanes: '4 Parallel x 25G',
			optics: '850nm (SR4) / 1310nm (CWDM4)',
			connector: 'MPO-12 or LC'
		},
		'QSFP-DD': {
			speed: '400 Gbps',
			lanes: '8 Parallel x 50G PAM4',
			optics: '850nm (SR8) / 1310nm (DR4)',
			connector: 'MPO-16 or CS'
		}
	};

	let activeSpec = $derived(formFactorSpecs[formFactor]);
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Radio class="h-4 w-4" /> Optical Transceiver & DOM Diagnostics
			</h2>
			<span class="badge badge-xs font-bold badge-primary">L1 / L2 HARDWARE</span>
		</div>

		<!-- Transceiver Form Factor Selector -->
		<div class="my-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-3">
				<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
					>Select Transceiver Form Factor:</span
				>
				<div class="join w-full">
					{#each ['SFP+', 'QSFP28', 'QSFP-DD'] as form (form)}
						<button
							onclick={() => (formFactor = form as 'SFP+' | 'QSFP28' | 'QSFP-DD')}
							class="btn join-item flex-1 font-mono btn-xs {formFactor === form
								? 'text-primary-content btn-primary'
								: 'border-base-300 btn-outline'}"
						>
							{form}
						</button>
					{/each}
				</div>

				<div class="space-y-1.5 rounded-lg border border-base-300 bg-base-200 p-3 text-xs">
					<div class="flex justify-between">
						<span class="text-neutral-content/60">Speed Rating:</span>
						<span class="font-bold text-primary">{activeSpec.speed}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-content/60">Channel Lanes:</span>
						<span class="font-bold">{activeSpec.lanes}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-content/60">Wavelength Options:</span>
						<span class="font-bold">{activeSpec.optics}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-neutral-content/60">Physical Interface:</span>
						<span class="font-bold text-accent">{activeSpec.connector}</span>
					</div>
				</div>
			</div>

			<!-- Optical Power Conversion (mW to dBm) -->
			<div class="space-y-3 rounded-lg border border-base-300 bg-base-200 p-3">
				<span class="block text-[10px] font-bold text-accent uppercase"
					>Digital Optical Monitoring (DOM) Power Converter</span
				>

				<div class="form-control">
					<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
						>Laser Rx Power (Milliwatts - mW):</span
					>
					<input
						type="number"
						step="0.01"
						min="0"
						bind:value={inputMilliwatts}
						class="input-bordered input w-full font-mono text-xs input-xs input-primary"
					/>
				</div>

				<div
					class="flex items-center justify-between rounded-lg border border-neutral-content/10 bg-neutral p-3 text-xs text-neutral-content"
				>
					<div>
						<p class="text-[9px] font-bold text-neutral-content/60 uppercase">
							Calculated Decibel-Milliwatts:
						</p>
						<p class="font-mono text-lg font-black text-primary">
							{calculatedDbm} <span class="text-xs">dBm</span>
						</p>
					</div>
					<div class="text-right">
						<span class="block text-[9px] font-bold text-neutral-content/50 uppercase"
							>DOM Health Status</span
						>
						<span class="text-xs font-bold {opticalStatus.color}">{opticalStatus.label}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
