<script lang="ts">
	import { Check, CircleQuestionMark, Copy, Terminal } from '@lucide/svelte';

	type CategoryType = 'System' | 'Storage' | 'Network' | 'OOB & Logs';
	let selectedCategory = $state<CategoryType>('System');
	let activeCommandIndex = $state(0);
	let activePresetIndex = $state(0);
	let targetArg = $state('');
	let copied = $state(false);

	interface Preset {
		label: string;
		desc: string;
		cmdPattern: (target: string) => string;
	}

	interface DiagnosticCommand {
		name: string;
		category: CategoryType;
		shortDesc: string;
		techContext: string;
		defaultTarget: string;
		targetLabel: string;
		presets: Preset[];
		interviewTip: string;
	}

	const allCommands: DiagnosticCommand[] = [
		{
			name: 'dmidecode',
			category: 'System',
			shortDesc: 'Dump system DMI/SMBIOS hardware tables',
			techContext:
				'Extract system serial numbers (FRUs), inventory motherboard layouts, and analyze memory lanes physically.',
			defaultTarget: 'memory',
			targetLabel: 'SMBIOS Type',
			presets: [
				{
					label: 'Audit RAM DIMM Slots',
					desc: 'Identify physical capacity, current speed, and active slots.',
					cmdPattern: (target) => `sudo dmidecode -t ${target || 'memory'}`
				},
				{
					label: 'Extract System Serial / Asset Tag',
					desc: 'Identify system serial numbers to coordinate server part swaps.',
					cmdPattern: () => 'sudo dmidecode -s system-serial-number'
				}
			],
			interviewTip:
				"Run 'dmidecode -t memory' to discover empty or degraded memory slots on remote hypervisors."
		},
		{
			name: 'lspci',
			category: 'System',
			shortDesc: 'Query Peripheral Component Interconnect (PCI) buses',
			techContext:
				'Verify physical connectivity of NVMe expansion adapters, HBA cards, or network controllers.',
			defaultTarget: 'network',
			targetLabel: 'Filter Keyword',
			presets: [
				{
					label: 'Isolate Device Class',
					desc: 'Search standard PCI devices for high-density cards.',
					cmdPattern: (target) => `lspci | grep -i "${target || 'network'}"`
				},
				{
					label: 'Query PCIe Link Speeds & Gen Widths',
					desc: 'Evaluate negotiated lanes to identify physical interface limits.',
					cmdPattern: () => "lspci -vvv | grep -i -E 'LnkCap|LnkSta'"
				}
			],
			interviewTip:
				"If a card underperforms, run 'lspci -vvv' and verify LnkCap matches LnkSta to check for link-width degradation."
		},
		{
			name: 'lshw',
			category: 'System',
			shortDesc: 'List comprehensive hardware configurations',
			techContext:
				'A broad diagnostic utility providing layout tables mapping memory, firmware, and network physical paths.',
			defaultTarget: 'network',
			targetLabel: 'Hardware Class',
			presets: [
				{
					label: 'Generate Brief Device Summary',
					desc: 'A scannable directory list mapping out local hardware.',
					cmdPattern: () => 'sudo lshw -short'
				},
				{
					label: 'Isolate Hardware Class to JSON',
					desc: 'Extract structured telemetry values suitable for system logs.',
					cmdPattern: (target) => `sudo lshw -C ${target || 'network'} -json`
				}
			],
			interviewTip:
				'lshw correlates physical hardware paths directly to target OS logical identifiers in one command output.'
		},
		{
			name: 'lsblk',
			category: 'Storage',
			shortDesc: 'Enumerate active block storage devices',
			techContext:
				'Identify mount targets, partition boundaries, block paths, and logical disk sizes.',
			defaultTarget: '/dev/sda',
			targetLabel: 'Block Target',
			presets: [
				{
					label: 'List File Systems & UUIDs',
					desc: 'Expose UUID identifiers to build stable partition mappings.',
					cmdPattern: () => 'lsblk -f'
				},
				{
					label: 'Map Custom Drive Attributes',
					desc: 'Retrieve block storage along with drive serial numbers.',
					cmdPattern: () => 'lsblk -o NAME,FSTYPE,SIZE,MODEL,SERIAL'
				}
			],
			interviewTip:
				"Always bind partitions using UUID outputs from 'lsblk -f' inside /etc/fstab to prevent boot loops if drive order shifts."
		},
		{
			name: 'lsscsi',
			category: 'Storage',
			shortDesc: 'Enumerate SCSI devices and attributes',
			techContext: 'Scan SAS drive chassis, storage arrays, and attached physical backup systems.',
			defaultTarget: '',
			targetLabel: 'None (Global)',
			presets: [
				{
					label: 'Map SCSI Device Tree',
					desc: 'Correlate OS drive letters to logical SCSI paths.',
					cmdPattern: () => 'lsscsi -g'
				},
				{
					label: 'Map SCSI Transport Protocols',
					desc: 'Isolate underlying transport connections (SAS, SATA, FC).',
					cmdPattern: () => 'lsscsi -t'
				}
			],
			interviewTip:
				"Use 'lsscsi' to verify SCSI target device registration on systems connected to SAS expanders."
		},
		{
			name: 'smartctl',
			category: 'Storage',
			shortDesc: 'S.M.A.R.T. Drive Diagnostics',
			techContext:
				'Audit hard drive failure parameters, mechanical warnings, bad sectors, and error registers.',
			defaultTarget: '/dev/sda',
			targetLabel: 'Target Disk Pathway',
			presets: [
				{
					label: 'Display Drive Health Assessment',
					desc: 'Run a simple pass/fail query on the target drive.',
					cmdPattern: (target) => `sudo smartctl -H ${target || '/dev/sda'}`
				},
				{
					label: 'Dump All SMART Attributes',
					desc: 'Expose sector reallocations, power hours, and read/write failures.',
					cmdPattern: (target) => `sudo smartctl -a ${target || '/dev/sda'}`
				}
			],
			interviewTip:
				"Monitor 'Reallocated_Sector_Ct'. A rising counter indicates degrading platters or failing SSD block media."
		},
		{
			name: 'nvme',
			category: 'Storage',
			shortDesc: 'PCIe NVMe Controller Utility',
			techContext:
				'Format namespaces, evaluate solid-state wear parameters, and check thermal levels on NVMe controllers.',
			defaultTarget: '/dev/nvme0',
			targetLabel: 'Target NVMe Controller',
			presets: [
				{
					label: 'List Active NVMe Devices',
					desc: 'Detect and index active NVMe SSD paths.',
					cmdPattern: () => 'sudo nvme list'
				},
				{
					label: 'Query Wear & SMART Telemetry',
					desc: 'Retrieve thermal alerts and percentage of device life used.',
					cmdPattern: (target) => `sudo nvme smart-log ${target || '/dev/nvme0'}`
				},
				{
					label: 'Format Sector Size (4K LBA Format)',
					desc: 'Format NVMe block layers to high-performance 4096-byte logical sectors (Corrected: --lbaf).',
					cmdPattern: (target) =>
						`sudo nvme format ${target || '/dev/nvme0'} --namespace-id=1 --lbaf=1`
				}
			],
			interviewTip:
				"Format NVMe disks to 4K block boundaries using '--lbaf=1' (on supporting drives) to maximize database read speeds."
		},
		{
			name: 'ethtool',
			category: 'Network',
			shortDesc: 'Configure Physical NIC Properties',
			techContext:
				'Control speed negotiation, duplex limits, ring buffers, and diagnostic SFP transceiver metrics.',
			defaultTarget: 'eth0',
			targetLabel: 'Interface Name',
			presets: [
				{
					label: 'Inspect Duplex and Speed Negotiation',
					desc: 'Verify link negotiation and physical hardware speed thresholds.',
					cmdPattern: (target) => `sudo ethtool ${target || 'eth0'}`
				},
				{
					label: 'Display SFP/SFP+ Transceiver Diagnostics',
					desc: 'Read optical transceivers, laser temperatures, and incoming signal levels (Rx/Tx).',
					cmdPattern: (target) => `sudo ethtool -m ${target || 'eth0'}`
				}
			],
			interviewTip:
				"Use 'ethtool -m <interface>' to debug fiber drops. If the laser Rx power drops below -15dBm, clean the connectors."
		},
		{
			name: 'ipmitool',
			category: 'OOB & Logs',
			shortDesc: 'BMC Out-Of-Band Command Line Utility',
			techContext:
				'Connect directly to the server baseboard controller to power-cycle, read temperatures, and audit hardware warnings.',
			defaultTarget: '1',
			targetLabel: 'IPMI Lan Channel ID',
			presets: [
				{
					label: 'Print Out-Of-Band IP Configuration',
					desc: 'Inspect the management network layout.',
					cmdPattern: (target) => `sudo ipmitool lan print ${target || '1'}`
				},
				{
					label: 'View Hardware Event Logs (SEL)',
					desc: 'Query logs directly from the BMC to identify physical power supply or chassis alerts.',
					cmdPattern: () => 'sudo ipmitool sel list'
				}
			],
			interviewTip:
				'When operating systems hang, run remote BMC commands over IPMI to power-cycle hypervisors out-of-band.'
		},
		{
			name: 'dmesg',
			category: 'OOB & Logs',
			shortDesc: 'Inspect kernel ring logs',
			techContext: 'Diagnose device initialization failures, CPU warnings, and memory failures.',
			defaultTarget: 'error',
			targetLabel: 'Keyword Filter',
			presets: [
				{
					label: 'Real-Time Tail Log Streamer',
					desc: 'Track incoming system events live in the active terminal.',
					cmdPattern: () => 'sudo dmesg -w'
				},
				{
					label: 'Filter for Critical System and Core Warnings',
					desc: 'Isolate memory parity errors and hard faults.',
					cmdPattern: (target) => `sudo dmesg -T | grep -Ei '${target || 'error'}|fail|panic|mce'`
				}
			],
			interviewTip:
				'A Machine Check Exception (MCE) inside dmesg logs indicates a critical physical fault in memory, system bus, or CPU lanes.'
		}
	];

	// Dynamic Derived Calculations with Fallbacks (Protects against out-of-bounds indices)
	let visibleCommands = $derived(allCommands.filter((cmd) => cmd.category === selectedCategory));

	let activeCommand = $derived(
		visibleCommands[activeCommandIndex] || visibleCommands[0] || allCommands[0]
	);

	let activePreset = $derived(activeCommand.presets[activePresetIndex] || activeCommand.presets[0]);

	let assembledCommand = $derived(activePreset.cmdPattern(targetArg));

	// Sync state cleanly when category is changed
	$effect(() => {
		targetArg = activeCommand.defaultTarget;
		activePresetIndex = 0;
	});

	async function copyCommand() {
		await navigator.clipboard.writeText(assembledCommand);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function handleCategoryChange(cat: CategoryType) {
		selectedCategory = cat;
		activeCommandIndex = 0;
	}
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-xl">
	<div class="card-body p-4">
		<div
			class="mb-3 flex flex-col items-start justify-between gap-3 border-b border-base-200 pb-3 md:flex-row md:items-center"
		>
			<div>
				<h2
					class="text-md card-title flex items-center gap-2 font-black tracking-wider text-accent uppercase"
				>
					<Terminal class="h-5 w-5" /> Bare-Metal Diagnostic Suite
				</h2>
			</div>

			<div class="flex flex-wrap gap-1 rounded-lg border border-base-300 bg-base-200 p-0.5">
				{#each ['System', 'Storage', 'Network', 'OOB & Logs'] as Category (Category)}
					<button
						onclick={() => handleCategoryChange(Category as CategoryType)}
						class="btn-[10px] btn h-7 rounded-md px-2.5 font-mono transition-all {selectedCategory ===
						Category
							? 'text-primary-content btn-primary'
							: 'btn-ghost text-base-content'}"
					>
						{Category}
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
			<div class="flex flex-col gap-1 border-r border-base-200 pr-0 lg:col-span-4 lg:pr-3">
				{#each visibleCommands as cmd, idx (cmd.name)}
					<button
						onclick={() => {
							activeCommandIndex = idx;
						}}
						class="btn h-9 justify-start font-mono transition-all btn-xs {activeCommandIndex === idx
							? 'text-primary-content shadow btn-primary'
							: 'bg-base-200/50 btn-ghost'}"
					>
						<span class="text-xs font-bold">{cmd.name}</span>
					</button>
				{/each}
			</div>

			<div class="space-y-4 lg:col-span-8">
				<div class="rounded-xl border border-base-200 bg-base-200/55 p-3 text-xs">
					<div class="mb-1 flex items-center justify-between">
						<span class="badge text-[9px] font-black uppercase badge-accent"
							>{activeCommand.category} TOOL</span
						>
						<span class="font-black text-primary">{activeCommand.name}</span>
					</div>
					<p class="font-bold text-base-content">{activeCommand.shortDesc}</p>
					<p class="mt-1 text-[11px] text-neutral-content/90">{activeCommand.techContext}</p>
				</div>

				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
							>Select Preset:</span
						>
						<div class="flex flex-col gap-1.5">
							{#each activeCommand.presets as p, idx (p.label)}
								<button
									onclick={() => (activePresetIndex = idx)}
									class="flex flex-col gap-0.5 rounded-lg border p-2.5 text-left font-mono text-[11px] transition-all
                  {activePresetIndex === idx
										? 'border-primary bg-primary/10 text-primary'
										: 'border-base-300 bg-base-200'}"
								>
									<span class="font-bold">{p.label}</span>
									<span class="text-[10px] text-neutral-content">{p.desc}</span>
								</button>
							{/each}
						</div>
					</div>

					<div class="space-y-3">
						{#if activeCommand.targetLabel !== 'None (Global)'}
							<div class="form-control w-full">
								<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
									>{activeCommand.targetLabel}:</span
								>
								<input
									type="text"
									bind:value={targetArg}
									class="input-bordered input h-8 w-full font-mono text-[11px] input-xs input-primary"
								/>
							</div>
						{/if}

						<div
							class="relative rounded-lg border border-neutral-content/10 bg-neutral p-3 text-neutral-content shadow-inner"
						>
							<span
								class="absolute top-1.5 right-2 text-[8px] font-bold text-neutral-content/30 uppercase"
								>CLI Output</span
							>
							<p class="mb-1 text-[9px] text-neutral-content/50 uppercase">Executable Command:</p>
							<code class="block pr-6 text-xs leading-tight font-bold break-all text-accent">
								$ {assembledCommand}
							</code>
							<div class="mt-2.5 flex justify-end">
								<button onclick={copyCommand} class="btn h-7 min-h-0 font-mono btn-primary btn-xs">
									{#if copied}
										<Check class="mr-1 h-3 w-3" /> COPIED
									{:else}
										<Copy class="mr-1 h-3 w-3" /> COPY TO SHELL
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div
					class="alert flex items-start gap-2 rounded-lg border-info/15 bg-info/5 p-3 font-mono text-xs alert-info text-info"
				>
					<CircleQuestionMark class="mt-0.5 h-4 w-4 shrink-0" />
					<div>
						<h4 class="text-[10px] font-bold tracking-wider text-accent uppercase">
							Interview Insight
						</h4>
						<p class="mt-0.5 text-[11px] leading-normal text-base-content/95">
							{activeCommand.interviewTip}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
