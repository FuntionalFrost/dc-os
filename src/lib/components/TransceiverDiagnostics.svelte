<script lang="ts">
	import { Radio, Search, Layers, Server } from '@lucide/svelte';
	import { DataTable, Tabs, Badge, type Column, type TabItem } from 'yaxa-svelte';
	import {
		transceiverSpecs,
		servicePorts,
		type TransceiverSpec,
		type ServicePort
	} from '$lib/data/transceivers';

	let formFactor = $state<'SFP+' | 'QSFP28' | 'QSFP-DD'>('SFP+');
	let inputMilliwatts = $state(0.38); // 0.380 mW default
	let activeTab = $state<'specs' | 'ports' | 'dom'>('specs');
	let searchQuery = $state('');

	const tabs: TabItem[] = [
		{ value: 'specs', label: 'TRANSCEIVER MATRIX', icon: Radio },
		{ value: 'dom', label: 'DOM CALCULATOR', icon: Layers },
		{ value: 'ports', label: 'PORT DIRECTORY', icon: Server }
	];

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

	const transceiverColumns: Column<TransceiverSpec>[] = [
		{ key: 'standard', label: 'Standard', sortable: true },
		{ key: 'formFactor', label: 'Form Factor', sortable: true },
		{ key: 'speed', label: 'Speed', sortable: true },
		{ key: 'media', label: 'Media Type', sortable: true },
		{ key: 'reach', label: 'Max Reach', sortable: true },
		{ key: 'wavelength', label: 'Wavelength (λ)', sortable: true },
		{ key: 'connector', label: 'Connector', sortable: true },
		{ key: 'rxRange', label: 'Typical Rx Window' }
	];

	const portColumns: Column<ServicePort>[] = [
		{ key: 'port', label: 'Port', sortable: true, width: 80 },
		{ key: 'protocol', label: 'Protocol', sortable: true, width: 100 },
		{ key: 'service', label: 'Service / Application', sortable: true },
		{ key: 'category', label: 'Category', sortable: true },
		{ key: 'description', label: 'Data Center Function' }
	];
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<!-- Header Controls -->
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Radio class="h-4 w-4" /> Optical Transceiver & Port Directory
			</h2>
			<Tabs items={tabs} bind:value={activeTab} variant="segmented" class="text-xs" />
		</div>

		{#if activeTab === 'specs'}
			<!-- Tab 1: Transceiver Spec Matrix DataTable -->
			<div class="mt-3 space-y-3">
				<div class="flex flex-wrap items-center justify-between gap-2">
					<div class="relative w-full max-w-xs">
						<Search class="absolute top-2 left-2.5 h-3.5 w-3.5 text-neutral-content/50" />
						<input
							type="text"
							placeholder="Search 100G, SMF, CWDM4, LC..."
							bind:value={searchQuery}
							class="input-bordered input input-xs w-full pl-8 font-mono text-xs"
						/>
					</div>
					<Badge variant="subtle" color="primary" size="xs">
						{transceiverSpecs.length} OPTIC STANDARDS
					</Badge>
				</div>

				<div class="overflow-x-auto rounded-lg border border-base-300">
					<DataTable
						data={transceiverSpecs}
						columns={transceiverColumns}
						{searchQuery}
						searchKeys={[
							'standard',
							'formFactor',
							'speed',
							'media',
							'wavelength',
							'connector',
							'typicalUse'
						]}
						class="text-xs"
					/>
				</div>
			</div>
		{:else}
			{#if activeTab === 'dom'}
				<!-- Tab 2: DOM Converter & Form Factor Inspector -->
				<div class="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-3">
						<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
							>Select Transceiver Form Factor:</span
						>
						<div class="join w-full">
							{#each ['SFP+', 'QSFP28', 'QSFP-DD'] as form (form)}
								<button
									onclick={() => (formFactor = form as 'SFP+' | 'QSFP28' | 'QSFP-DD')}
									class="btn join-item btn-xs flex-1 font-mono {formFactor === form
										? 'btn-primary text-primary-content'
										: 'btn-outline border-base-300'}"
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
								class="input-bordered input input-xs input-primary w-full font-mono text-xs"
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
			{:else}
				<!-- Tab 3: Common Data Center Service Ports -->
				<div class="mt-3 space-y-3">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div class="relative w-full max-w-xs">
							<Search class="absolute top-2 left-2.5 h-3.5 w-3.5 text-neutral-content/50" />
							<input
								type="text"
								placeholder="Search BGP, 623, IPMI, SSH..."
								bind:value={searchQuery}
								class="input-bordered input input-xs w-full pl-8 font-mono text-xs"
							/>
						</div>
						<Badge variant="subtle" color="info" size="xs">
							{servicePorts.length} CORE PORTS
						</Badge>
					</div>

					<div class="overflow-x-auto rounded-lg border border-base-300">
						<DataTable
							data={servicePorts}
							columns={portColumns}
							{searchQuery}
							searchKeys={['port', 'protocol', 'service', 'keyword', 'description', 'category']}
							class="text-xs"
						/>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
