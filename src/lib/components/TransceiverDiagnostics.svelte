<script lang="ts">
	import { Activity, Cable, Layers, Radio, Server } from '@lucide/svelte';
	import { DataTable, Tabs, type TabItem, type Column } from 'yaxa-svelte';
	import {
		transceiverSpecs,
		servicePorts,
		type TransceiverSpec,
		type ServicePort
	} from '$lib/data/transceivers';

	let formFactor = $state<'SFP+' | 'QSFP28' | 'QSFP-DD'>('SFP+');
	let inputMilliwatts = $state(0.38); // 0.380 mW default
	let activeTab = $state<'specs' | 'ports' | 'dom'>('specs');

	const tabs: TabItem[] = [
		{ value: 'specs', label: 'TRANSCEIVER MATRIX', icon: Radio },
		{ value: 'dom', label: 'DOM CALCULATOR', icon: Layers },
		{ value: 'ports', label: 'PORT DIRECTORY', icon: Server }
	];

	const specColumns: Column<TransceiverSpec>[] = [
		{ key: 'standard', label: 'Standard', sortable: true },
		{ key: 'formFactor', label: 'Form Factor', sortable: true },
		{ key: 'speed', label: 'Speed', sortable: true },
		{ key: 'media', label: 'Media Type', sortable: true },
		{ key: 'reach', label: 'Max Reach', sortable: true },
		{ key: 'wavelength', label: 'Wavelength (λ)', sortable: true },
		{ key: 'connector', label: 'Connector', sortable: true },
		{ key: 'rxRange', label: 'Typical Rx Window', sortable: true }
	];

	const portColumns: Column<ServicePort>[] = [
		{ key: 'port', label: 'Port', sortable: true },
		{ key: 'protocol', label: 'Protocol', sortable: true },
		{ key: 'service', label: 'Service / Application', sortable: true },
		{ key: 'category', label: 'Category', sortable: true },
		{ key: 'description', label: 'Data Center Function', sortable: true }
	];

	// Optical Power formula: dBm = 10 * log10(P_mW)
	let calculatedDbm = $derived.by(() => {
		if (inputMilliwatts <= 0) return '-∞';
		const dbm = 10 * Math.log10(inputMilliwatts);
		return dbm.toFixed(2);
	});

	// Evaluate optical power status thresholds
	let opticalStatus = $derived.by(() => {
		const dbmVal = parseFloat(calculatedDbm);
		if (isNaN(dbmVal))
			return { label: 'NO SIGNAL', color: 'text-error', bg: 'bg-error/20 border-error/40' };
		if (dbmVal >= -2.0 && dbmVal <= 0.5)
			return {
				label: 'EXCELLENT (OPTIMAL LAUNCH)',
				color: 'text-success',
				bg: 'bg-success/20 border-success/40'
			};
		if (dbmVal >= -9.5 && dbmVal < -2.0)
			return {
				label: 'GOOD (STANDARD OPERATIONAL)',
				color: 'text-success',
				bg: 'bg-success/20 border-success/40'
			};
		if (dbmVal >= -14.0 && dbmVal < -9.5)
			return {
				label: 'WARN (MARGINAL ATTENUATION)',
				color: 'text-warning',
				bg: 'bg-warning/20 border-warning/40'
			};
		return {
			label: 'CRITICAL FAIL (HIGH DIRT / LOSS)',
			color: 'text-error',
			bg: 'bg-error/20 border-error/40'
		};
	});

	const formFactorSpecs = {
		'SFP+': {
			speed: '10 Gbps',
			lanes: '1 Channel',
			optics: '850nm (SR) / 1310nm (LR)',
			connector: 'LC Duplex',
			color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
		},
		QSFP28: {
			speed: '100 Gbps',
			lanes: '4 Parallel x 25G',
			optics: '850nm (SR4) / 1310nm (CWDM4)',
			connector: 'MPO-12 or LC',
			color: 'border-amber-500/40 text-amber-400 bg-amber-500/10'
		},
		'QSFP-DD': {
			speed: '400 Gbps',
			lanes: '8 Parallel x 50G PAM4',
			optics: '850nm (SR8) / 1310nm (DR4)',
			connector: 'MPO-16 or CS',
			color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
		}
	};

	let activeSpec = $derived(formFactorSpecs[formFactor]);

	function getSpeedBadgeColor(speed: string) {
		if (speed.includes('400')) return 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300';
		if (speed.includes('100')) return 'border-amber-400/40 bg-amber-500/20 text-amber-300';
		if (speed.includes('40')) return 'border-purple-400/40 bg-purple-500/20 text-purple-300';
		if (speed.includes('25')) return 'border-blue-400/40 bg-blue-500/20 text-blue-300';
		return 'border-cyan-400/40 bg-cyan-500/20 text-cyan-300';
	}

	function getMediaBadge(media: string) {
		if (media.includes('MMF')) {
			return { label: media, cls: 'border-orange-500/40 bg-orange-500/20 text-orange-300' };
		}
		return { label: media, cls: 'border-yellow-400/40 bg-yellow-500/20 text-yellow-300' };
	}

	function getWavelengthBadge(wl: string) {
		if (wl.includes('850'))
			return { label: wl, cls: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
		if (wl.includes('1310'))
			return { label: wl, cls: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
		return { label: wl, cls: 'text-purple-300 border-purple-500/30 bg-purple-500/10' };
	}

	function getPortCategoryBadge(cat: string) {
		if (cat.includes('Management')) return 'border-cyan-400/40 bg-cyan-500/20 text-cyan-300';
		if (cat.includes('Infrastructure'))
			return 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300';
		if (cat.includes('Routing')) return 'border-purple-400/40 bg-purple-500/20 text-purple-300';
		return 'border-amber-400/40 bg-amber-500/20 text-amber-300';
	}

	function getProtocolBadge(proto: string) {
		if (proto === 'TCP') return 'border-blue-400/40 bg-blue-500/20 text-blue-300';
		if (proto === 'UDP') return 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300';
		return 'border-purple-400/40 bg-purple-500/20 text-purple-300';
	}
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
			<!-- Tab 1: Transceiver Spec Matrix -->
			<div class="mt-3 space-y-3">
				<DataTable
					data={transceiverSpecs}
					columns={specColumns}
					showSearch={true}
					showExport={true}
					showColumnToggle={true}
					pagination={true}
					pageSize={10}
					class="border border-base-300 bg-base-200/40"
				>
					{#snippet cell(spec, column)}
						{#if column.key === 'standard'}
							<span
								class="rounded-md border border-base-300 bg-base-300/60 px-2 py-0.5 font-bold text-primary"
							>
								{spec.standard}
							</span>
						{:else if column.key === 'formFactor'}
							<span
								class="rounded border border-base-300 bg-base-200 px-2 py-0.5 text-[11px] font-bold text-neutral-content"
							>
								{spec.formFactor}
							</span>
						{:else if column.key === 'speed'}
							<span
								class="rounded border px-2 py-0.5 text-[11px] font-black {getSpeedBadgeColor(
									spec.speed
								)}"
							>
								{spec.speed}
							</span>
						{:else if column.key === 'media'}
							{@const mediaBadge = getMediaBadge(spec.media)}
							<span class="rounded border px-2 py-0.5 text-[10px] font-bold {mediaBadge.cls}">
								{mediaBadge.label}
							</span>
						{:else if column.key === 'reach'}
							<span class="font-medium whitespace-nowrap text-neutral-content">{spec.reach}</span>
						{:else if column.key === 'wavelength'}
							{@const wlBadge = getWavelengthBadge(spec.wavelength)}
							<span class="rounded border px-2 py-0.5 text-[10px] font-bold {wlBadge.cls}">
								{wlBadge.label}
							</span>
						{:else if column.key === 'connector'}
							<span
								class="rounded border border-base-300 bg-base-100 px-1.5 py-0.5 text-[10px] font-bold text-accent"
							>
								{spec.connector}
							</span>
						{:else if column.key === 'rxRange'}
							<span
								class="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300"
							>
								{spec.rxRange}
							</span>
						{:else}
							<span>{spec[column.key as keyof TransceiverSpec]}</span>
						{/if}
					{/snippet}
				</DataTable>
			</div>
		{:else if activeTab === 'dom'}
			<!-- Tab 2: DOM Converter & Form Factor Inspector -->
			<div class="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-3">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase">
						Select Transceiver Form Factor:
					</span>
					<div class="join w-full">
						{#each ['SFP+', 'QSFP28', 'QSFP-DD'] as form (form)}
							<button
								onclick={() => (formFactor = form as 'SFP+' | 'QSFP28' | 'QSFP-DD')}
								class="btn join-item btn-xs flex-1 font-mono transition-all {formFactor === form
									? 'btn-primary text-primary-content shadow-sm'
									: 'btn-outline border-base-300'}"
							>
								{form}
							</button>
						{/each}
					</div>

					<div class="space-y-2 rounded-xl border border-base-300 bg-base-200/80 p-4 text-xs">
						<div class="flex items-center justify-between border-b border-base-300 pb-2">
							<span class="flex items-center gap-1.5 font-bold text-accent uppercase">
								<Activity class="h-3.5 w-3.5" />
								{formFactor} Physical Profile
							</span>
							<span class="rounded border px-2 py-0.5 text-[10px] font-bold {activeSpec.color}">
								{activeSpec.speed}
							</span>
						</div>
						<div class="flex justify-between py-0.5">
							<span class="text-neutral-content/70">Channel Lanes:</span>
							<span class="font-bold text-base-content">{activeSpec.lanes}</span>
						</div>
						<div class="flex justify-between py-0.5">
							<span class="text-neutral-content/70">Wavelength Options:</span>
							<span class="font-bold text-base-content">{activeSpec.optics}</span>
						</div>
						<div class="flex justify-between py-0.5">
							<span class="text-neutral-content/70">Physical Interface:</span>
							<span class="font-bold text-accent">{activeSpec.connector}</span>
						</div>
					</div>
				</div>

				<!-- Optical Power Conversion (mW to dBm) -->
				<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/80 p-4">
					<div class="flex items-center justify-between border-b border-base-300 pb-2">
						<span class="flex items-center gap-1.5 text-[11px] font-bold text-accent uppercase">
							<Cable class="h-3.5 w-3.5" /> DOM Rx Optical Telemetry
						</span>
						<span class="text-[9px] text-neutral-content/60">Formula: 10·log₁₀(mW)</span>
					</div>

					<div class="form-control">
						<span class="label py-0.5 text-[10px] font-bold text-neutral-content/70 uppercase">
							Laser Rx Power Input (Milliwatts - mW):
						</span>
						<input
							type="number"
							step="0.01"
							min="0"
							bind:value={inputMilliwatts}
							class="input-bordered input input-sm input-primary w-full font-mono text-xs font-bold"
						/>
					</div>

					<div
						class="flex items-center justify-between rounded-xl border p-3.5 shadow-inner {opticalStatus.bg}"
					>
						<div>
							<p class="text-[9px] font-bold text-neutral-content/70 uppercase">
								Calculated Decibel-Milliwatts:
							</p>
							<p class="font-mono text-2xl font-black text-primary">
								{calculatedDbm} <span class="text-xs font-bold text-neutral-content">dBm</span>
							</p>
						</div>
						<div class="text-right">
							<span class="block text-[9px] font-bold text-neutral-content/60 uppercase">
								DOM Status
							</span>
							<span class="text-xs font-black {opticalStatus.color}">{opticalStatus.label}</span>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Tab 3: Common Data Center Service Ports -->
			<div class="mt-3 space-y-3">
				<DataTable
					data={servicePorts}
					columns={portColumns}
					showSearch={true}
					showExport={true}
					showColumnToggle={true}
					pagination={true}
					pageSize={12}
					class="border border-base-300 bg-base-200/40"
				>
					{#snippet cell(port, column)}
						{#if column.key === 'port'}
							<span
								class="rounded-md border border-primary/40 bg-primary/20 px-2 py-0.5 text-xs font-black text-primary shadow-xs"
							>
								:{port.port}
							</span>
						{:else if column.key === 'protocol'}
							<span
								class="rounded border px-2 py-0.5 text-[10px] font-bold {getProtocolBadge(
									port.protocol
								)}"
							>
								{port.protocol}
							</span>
						{:else if column.key === 'service'}
							<span class="font-bold text-base-content">{port.service}</span>
						{:else if column.key === 'category'}
							<span
								class="rounded border px-2 py-0.5 text-[10px] font-bold {getPortCategoryBadge(
									port.category
								)}"
							>
								{port.category}
							</span>
						{:else if column.key === 'description'}
							<span class="text-[11px] text-neutral-content/90">{port.description}</span>
						{:else}
							<span>{port[column.key as keyof ServicePort]}</span>
						{/if}
					{/snippet}
				</DataTable>
			</div>
		{/if}
	</div>
</div>
