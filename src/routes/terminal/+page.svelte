<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import TerminalSimulator from '$lib/components/TerminalSimulator.svelte';
	import { Play, Search, Terminal as TerminalIcon } from '@lucide/svelte';
	import { ResizablePanels, Kbd, Badge } from 'yaxa-svelte';

	type CommandCategory = 'all' | 'hardware' | 'storage' | 'network' | 'logs' | 'system';

	let terminalComp: { runExternalCommand: (cmd: string) => void } | null = $state(null);
	let filterQuery = $state('');
	let activeCategory = $state<CommandCategory>('all');

	const categoryTabs: { id: CommandCategory; label: string }[] = [
		{ id: 'all', label: 'ALL' },
		{ id: 'hardware', label: 'HW' },
		{ id: 'storage', label: 'DISK' },
		{ id: 'network', label: 'NET' },
		{ id: 'logs', label: 'LOGS' },
		{ id: 'system', label: 'SYS' }
	];

	interface DiagnosticCommand {
		command: string;
		label: string;
		description: string;
		category: 'hardware' | 'storage' | 'network' | 'logs' | 'system';
	}

	const diagnosticCommands: DiagnosticCommand[] = [
		// Hardware
		{
			command: 'dmidecode',
			label: 'System & BIOS Info',
			description: 'Read SMBIOS DMI tables, motherboard model & serial number',
			category: 'hardware'
		},
		{
			command: 'dmidecode -t memory',
			label: 'DIMM Memory Specs',
			description: 'RAM slot topology, manufacturer, speed & bus width',
			category: 'hardware'
		},
		{
			command: 'lshw',
			label: 'Hardware Tree',
			description: 'Hierarchical hardware tree and bus device class breakdown',
			category: 'hardware'
		},
		{
			command: 'lspci',
			label: 'PCIe Bus Devices',
			description: 'Enumerate PCIe slots, Mellanox NICs, NVMe host bridges',
			category: 'hardware'
		},
		// Storage
		{
			command: 'lsblk',
			label: 'Block Device Tree',
			description: 'List disk partitions, mountpoints, and block devices',
			category: 'storage'
		},
		{
			command: 'lsblk -f',
			label: 'Filesystems & UUIDs',
			description: 'Display filesystem types (ext4, xfs, vfat) & UUIDs',
			category: 'storage'
		},
		{
			command: 'smartctl -H /dev/sda',
			label: 'Drive Health Check',
			description: 'Query SMART self-assessment health status on /dev/sda',
			category: 'storage'
		},
		{
			command: 'nvme list',
			label: 'NVMe Controller List',
			description: 'Show NVMe SSD namespaces, capacity, firmware revision',
			category: 'storage'
		},
		{
			command: 'nvme smart-log /dev/nvme0',
			label: 'NVMe SMART Telemetry',
			description: 'Read temperature, percentage used, media wear & spare reserve',
			category: 'storage'
		},
		// Network
		{
			command: 'ethtool eth0',
			label: 'NIC Link Status & Speed',
			description: 'Query link speed, auto-negotiation, and duplex mode',
			category: 'network'
		},
		{
			command: 'ethtool -m eth0',
			label: 'SFP+ DOM Optical Telemetry',
			description: 'Read transceiver Rx/Tx laser power, wavelength, serial #',
			category: 'network'
		},
		{
			command: 'ip route',
			label: 'Routing Table',
			description: 'Kernel IPv4 routing table and default gateway hops',
			category: 'network'
		},
		// Logs & BMC
		{
			command: 'ipmitool sensor list',
			label: 'IPMI / BMC Sensors',
			description: 'Chassis fan RPMs, power supply voltages, ambient temperature',
			category: 'logs'
		},
		{
			command: 'dmesg',
			label: 'Kernel Ring Buffer',
			description: 'Kernel initialization logs, hardware fault alerts, PCIe events',
			category: 'logs'
		},
		// System
		{
			command: 'uname -a',
			label: 'Kernel & Architecture',
			description: 'Linux kernel release version and CPU architecture',
			category: 'system'
		},
		{
			command: 'free -m',
			label: 'Memory Allocation',
			description: 'RAM and swap usage in Megabytes (buff/cache breakdown)',
			category: 'system'
		},
		{
			command: 'df -h',
			label: 'Disk Space Utilization',
			description: 'Human-readable filesystem disk storage capacity',
			category: 'system'
		},
		{
			command: 'ps aux',
			label: 'Process Snapshot',
			description: 'Running system daemons and CPU/RAM consumption',
			category: 'system'
		}
	];

	let filteredCommands = $derived(
		diagnosticCommands.filter((c) => {
			const matchesCat = activeCategory === 'all' || c.category === activeCategory;
			const query = filterQuery.toLowerCase().trim();
			const matchesQuery =
				query === '' ||
				c.command.toLowerCase().includes(query) ||
				c.label.toLowerCase().includes(query) ||
				c.description.toLowerCase().includes(query);
			return matchesCat && matchesQuery;
		})
	);

	function executeCommand(cmd: string) {
		if (terminalComp) {
			terminalComp.runExternalCommand(cmd);
		}
	}
</script>

<SEO
	title="KVM Serial CLI Terminal Simulator"
	description="Full-screen interactive xterm.js KVM terminal console with hardware diagnostic command library (dmidecode, smartctl, ethtool, nvme, ipmitool)."
	path="/terminal"
	keywords={[
		'xterm.js terminal simulator',
		'kvm serial cli console',
		'dmidecode online test',
		'smartctl drive health command',
		'ethtool sfp optical transceiver telemetry',
		'nvme cli smart-log test',
		'ipmitool bmc sensor list',
		'linux sysadmin cli'
	]}
/>

<div class="flex h-[calc(100vh-6.5rem)] flex-col space-y-2 font-mono">
	<!-- KVM Header -->
	<div class="flex shrink-0 items-center justify-between border-b border-base-200 pb-2">
		<div>
			<h1 class="text-lg font-black tracking-wider text-primary uppercase">
				📟 KVM_CONSOLE // LIVE_SHELL
			</h1>
			<p class="text-[11px] text-neutral-content">
				Interactive CLI sandbox & live diagnostic command injector.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<div class="hidden items-center gap-1.5 text-xs text-neutral-content/70 lg:flex">
				<span class="text-[10px]">SHORTCUTS:</span>
				<Kbd size="xs">Ctrl+K</Kbd>
				<Kbd size="xs">help</Kbd>
				<Kbd size="xs">clear</Kbd>
			</div>
			<span class="badge badge-outline badge-sm badge-success font-bold">TTY1 ACTIVE</span>
			<span class="badge badge-ghost badge-sm font-bold text-neutral-content/60">BAUD 115200</span>
		</div>
	</div>

	<!-- Split Screen via ResizablePanels -->
	<div class="min-h-0 flex-1">
		<ResizablePanels
			direction="horizontal"
			defaultSize={65}
			minSize={35}
			maxSize={80}
			storageKey="dc-terminal-panel-split"
			class="h-full rounded-xl border border-base-200"
		>
			{#snippet first()}
				<div class="h-full min-h-0 p-1">
					<TerminalSimulator bind:this={terminalComp} />
				</div>
			{/snippet}

			{#snippet second()}
				<div class="flex h-full min-h-0 flex-col bg-base-100 p-3 font-mono">
					<!-- Command Drawer Header -->
					<div class="shrink-0 border-b border-base-200 pb-2">
						<div class="flex items-center justify-between">
							<span class="flex items-center gap-1.5 text-xs font-bold text-accent uppercase">
								<TerminalIcon class="h-3.5 w-3.5" /> Diagnostic Library
							</span>
							<Badge variant="subtle" color="primary" size="xs">
								{filteredCommands.length} COMMANDS
							</Badge>
						</div>

						<!-- Search Filter -->
						<div class="relative mt-2">
							<Search class="absolute top-2 left-2.5 h-3.5 w-3.5 text-neutral-content/50" />
							<input
								type="text"
								placeholder="Search smartctl, nvme, ethtool..."
								bind:value={filterQuery}
								class="input-bordered input input-xs w-full pl-8 font-mono text-xs"
							/>
						</div>

						<!-- Category Tabs -->
						<div class="mt-2 flex flex-wrap gap-1">
							{#each categoryTabs as cat (cat.id)}
								<button
									onclick={() => (activeCategory = cat.id)}
									class="btn btn-xs h-6 min-h-0 px-2 font-mono text-[10px] {activeCategory ===
									cat.id
										? 'btn-primary font-bold text-primary-content'
										: 'btn-ghost border border-base-300'}"
								>
									{cat.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Command List Container -->
					<div class="min-h-0 flex-1 space-y-2 overflow-y-auto pt-2">
						{#each filteredCommands as item (item.command)}
							<div
								class="flex flex-col justify-between gap-1.5 rounded-lg border border-base-300 bg-base-200/60 p-2 text-xs transition-colors hover:border-primary/50"
							>
								<div class="flex items-start justify-between gap-1">
									<div>
										<code class="font-bold text-primary">{item.command}</code>
										<p class="text-[11px] font-medium text-base-content">{item.label}</p>
									</div>
									<button
										onclick={() => executeCommand(item.command)}
										class="btn btn-primary btn-xs h-6 min-h-0 gap-1 font-mono text-[10px]"
										title="Execute in TTY"
									>
										<Play class="h-2.5 w-2.5 fill-current" /> RUN
									</button>
								</div>
								<p class="text-[10px] text-neutral-content/70">{item.description}</p>
							</div>
						{/each}

						{#if filteredCommands.length === 0}
							<div class="py-8 text-center text-xs text-neutral-content/60">
								No diagnostic commands match "{filterQuery}".
							</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</ResizablePanels>
	</div>
</div>
