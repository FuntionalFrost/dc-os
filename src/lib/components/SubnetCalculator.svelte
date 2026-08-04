<script lang="ts">
	import { Calculator, Check, Copy, Hash } from '@lucide/svelte';

	let cidrInput = $state('10.240.84.195/27');
	let copied = $state(false);

	// Preset scenarios commonly used in Data Centers
	const quickPresets = [
		{ label: '/24 Standard Rack', val: '192.168.1.100/24' },
		{ label: '/27 Small Subnet', val: '10.240.84.195/27' },
		{ label: '/30 P2P Router Link', val: '172.16.0.1/30' },
		{ label: '/31 RFC 3021 Link', val: '10.0.0.2/31' }
	];

	// Bitwise Subnet Math Engine using Svelte 5 $derived.by
	let parsedSubnet = $derived.by(() => {
		try {
			const trimmed = cidrInput.trim();
			if (!trimmed.includes('/')) return null;

			const [ipStr, prefixStr] = trimmed.split('/');
			const prefix = parseInt(prefixStr, 10);

			if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

			const octets = ipStr.split('.').map((n) => parseInt(n, 10));
			if (octets.length !== 4 || octets.some((n) => isNaN(n) || n < 0 || n > 255)) {
				return null;
			}

			// Convert octets to an unsigned 32-bit integer
			const ipNum = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

			// Calculate Network Bitmask & Wildcard
			const maskNum = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
			const wildcardNum = ~maskNum >>> 0;
			const netNum = (ipNum & maskNum) >>> 0;
			const bcastNum = (netNum | wildcardNum) >>> 0;

			const toIp = (num: number) =>
				[(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');

			const totalHosts = Math.pow(2, 32 - prefix);

			// Special Subnet Boundary Handling (/31 RFC 3021 & /32 Host Routes)
			let firstUsable: string;
			let lastUsable: string;
			let usableHosts: number;

			if (prefix === 32) {
				firstUsable = toIp(netNum);
				lastUsable = toIp(netNum);
				usableHosts = 1;
			} else if (prefix === 31) {
				firstUsable = toIp(netNum);
				lastUsable = toIp(bcastNum);
				usableHosts = 2; // RFC 3021 Point-to-Point
			} else {
				firstUsable = toIp(netNum + 1);
				lastUsable = toIp(bcastNum - 1);
				usableHosts = Math.max(0, totalHosts - 2);
			}

			// Format Binary Representation for visual teaching
			const binaryStr = maskNum.toString(2).padStart(32, '0');
			const binaryFormatted = binaryStr.match(/.{1,8}/g)?.join('.') || '';

			return {
				inputIp: ipStr,
				prefix,
				netmask: toIp(maskNum),
				wildcard: toIp(wildcardNum),
				networkIp: toIp(netNum),
				broadcastIp: toIp(bcastNum),
				firstUsable,
				lastUsable,
				totalHosts,
				usableHosts,
				binaryMask: binaryFormatted
			};
		} catch {
			return null;
		}
	});

	async function copySubnetDetails() {
		if (!parsedSubnet) return;
		const summary = `CIDR: ${cidrInput}
Network ID: ${parsedSubnet.networkIp}/${parsedSubnet.prefix}
Netmask: ${parsedSubnet.netmask}
Broadcast: ${parsedSubnet.broadcastIp}
Usable Range: ${parsedSubnet.firstUsable} - ${parsedSubnet.lastUsable} (${parsedSubnet.usableHosts} usable hosts)`;

		await navigator.clipboard.writeText(summary);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<!-- Component Header -->
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Calculator class="h-4 w-4" /> CIDR Subnet & Mask Calculator
			</h2>
			<span class="badge badge-xs font-bold badge-primary">IPV4 SUBNETTING</span>
		</div>

		<!-- Input Box & Presets -->
		<div class="my-2 flex flex-col items-start gap-3 sm:flex-row sm:items-end">
			<div class="form-control w-full flex-1">
				<span class="label py-0.5 text-[10px] font-bold text-neutral-content/60 uppercase"
					>Target IP / CIDR Prefix:</span
				>
				<input
					type="text"
					bind:value={cidrInput}
					placeholder="10.240.84.195/27"
					class="input-bordered input w-full font-mono text-xs font-bold input-sm input-primary"
				/>
			</div>

			<!-- Quick Preset Buttons -->
			<div class="flex flex-wrap gap-1">
				{#each quickPresets as preset (preset.val)}
					<button
						onclick={() => (cidrInput = preset.val)}
						class="btn-[10px] btn h-8 min-h-0 border border-base-300 bg-base-200 btn-ghost font-mono hover:border-primary"
					>
						{preset.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Calculated Metric Dashboard -->
		{#if parsedSubnet}
			<div class="mt-1 space-y-3">
				<!-- Main Stats Grid -->
				<div class="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
					<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
						<span class="block text-[9px] font-bold text-accent uppercase">Network Address</span>
						<span class="text-xs font-bold text-base-content"
							>{parsedSubnet.networkIp} / {parsedSubnet.prefix}</span
						>
					</div>

					<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
						<span class="block text-[9px] font-bold text-accent uppercase">Subnet Mask</span>
						<span class="text-xs font-bold text-base-content">{parsedSubnet.netmask}</span>
					</div>

					<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
						<span class="block text-[9px] font-bold text-accent uppercase">Broadcast Address</span>
						<span class="text-xs font-bold text-base-content">{parsedSubnet.broadcastIp}</span>
					</div>

					<div class="rounded-lg border border-base-300 bg-base-200 p-2.5">
						<span class="block text-[9px] font-bold text-accent uppercase">Usable Host Pool</span>
						<span class="text-xs font-bold text-base-content"
							>{parsedSubnet.usableHosts.toLocaleString()} Hosts</span
						>
					</div>
				</div>

				<!-- Range Details & Binary Mask -->
				<div
					class="flex flex-col items-start justify-between gap-2 rounded-lg border border-neutral-content/10 bg-neutral p-3 text-xs text-neutral-content sm:flex-row sm:items-center"
				>
					<div>
						<p class="text-[10px] font-bold text-neutral-content/60 uppercase">
							Usable Host Range:
						</p>
						<p class="font-mono text-sm font-black text-accent">
							{parsedSubnet.firstUsable} <span class="font-normal text-neutral-content/50">➔</span>
							{parsedSubnet.lastUsable}
						</p>
					</div>

					<div class="flex items-center gap-3">
						<div class="hidden text-right text-[10px] text-neutral-content/60 md:block">
							<p>
								Wildcard: <span class="font-mono text-neutral-content">{parsedSubnet.wildcard}</span
								>
							</p>
							<p>
								Binary Mask: <span class="font-mono text-neutral-content"
									>{parsedSubnet.binaryMask}</span
								>
							</p>
						</div>

						<button
							onclick={copySubnetDetails}
							class="btn font-mono tracking-wider btn-primary btn-xs"
						>
							{#if copied}
								<Check class="mr-1 h-3 w-3" /> COPIED
							{:else}
								<Copy class="mr-1 h-3 w-3" /> COPY SUMMARY
							{/if}
						</button>
					</div>
				</div>
			</div>
		{:else}
			<!-- Error State -->
			<div
				class="alert rounded-lg border-error/20 bg-error/10 p-2.5 font-mono text-xs alert-error text-error"
			>
				<Hash class="h-4 w-4 shrink-0" />
				<span
					>Invalid CIDR format. Use standard IPv4 notation with mask prefix (e.g. <code
						>10.240.84.195/27</code
					>).</span
				>
			</div>
		{/if}
	</div>
</div>
