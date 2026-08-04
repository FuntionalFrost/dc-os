<script lang="ts">
	import { Wrench } from '@lucide/svelte';

	let activeScenarioIndex = $state(0);
	let userChoice = $state<number | null>(null);
	let evaluated = $state(false);

	const handsOnScenarios = [
		{
			title: 'Scenario A: Interface Flapping & CRC Errors',
			setup:
				"An SFP+ trunk link on interface 'eth1' fluctuates between UP and DOWN state every 30 seconds. Running 'ethtool -S eth1' reveals rapidly increasing rx_crc_errors and rx_frame_errors.",
			options: [
				'Re-assign the switch VLAN tag from 100 to 200',
				"Unplug the SFP+ optic, inspect for dust, clean the fiber end-face with a one-click cleaner, and verify Rx power using 'ethtool -m eth1'",
				"Execute 'ip route flush cache' to clear stale routing ARP records",
				'Replace the host motherboard CPU'
			],
			correct: 1,
			resolution:
				"CRC errors indicate physical bit corruption occurring on the wire or optical core. Dirty fiber end-faces diffuse laser light, causing bit flips. Cleaning the bulkhead and checking 'ethtool -m' DOM optical power fixes 90% of flapping links."
		},
		{
			title: 'Scenario B: Server Boot Loop on Kernel Panic',
			setup:
				"After a kernel update, an Ubuntu server panics on boot: 'Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)'.",
			options: [
				'Re-format the entire NVMe array',
				"Boot into GRUB recovery mode, select the older working kernel version, and regenerate the initial RAM disk using 'update-initramfs -u'",
				'Replace the power supply units (PSUs)',
				'Change the DNS servers inside /etc/resolv.conf'
			],
			correct: 1,
			resolution:
				"The 'Unable to mount root fs' panic occurs when the kernel executes before storage drivers are available in memory, pointing to a corrupted or missing initramfs image. Regenerating initramfs fixes the driver tree."
		}
	];

	let currentScenario = $derived(handsOnScenarios[activeScenarioIndex]);

	function evaluateChoice() {
		if (userChoice === null) return;
		evaluated = true;
	}

	function nextScenario() {
		userChoice = null;
		evaluated = false;
		activeScenarioIndex = (activeScenarioIndex + 1) % handsOnScenarios.length;
	}
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Wrench class="h-4 w-4" /> Hands-On Field Troubleshooting Simulator
			</h2>
			<span class="badge badge-xs font-bold badge-warning">PRACTICAL SCENARIO</span>
		</div>

		<div class="my-2 space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-3">
			<h3 class="text-xs font-black text-primary uppercase">{currentScenario.title}</h3>
			<p class="text-xs leading-relaxed text-base-content">{currentScenario.setup}</p>

			<div class="space-y-2">
				{#each currentScenario.options as option, idx (idx)}
					<button
						onclick={() => {
							if (!evaluated) userChoice = idx;
						}}
						class="flex w-full items-center justify-between rounded-lg border p-2.5 text-left font-mono text-xs transition-all
            {userChoice === idx
							? 'border-primary bg-primary/10 font-bold text-primary'
							: 'border-base-300 bg-base-200'}
            {evaluated && idx === currentScenario.correct
							? 'border-success bg-success/15 text-success'
							: ''}
            {evaluated && userChoice === idx && userChoice !== currentScenario.correct
							? 'border-error bg-error/15 text-error'
							: ''}"
						disabled={evaluated}
					>
						<span>{option}</span>
					</button>
				{/each}
			</div>

			{#if !evaluated}
				<button
					onclick={evaluateChoice}
					disabled={userChoice === null}
					class="btn mt-2 w-full font-mono tracking-wider btn-primary btn-xs"
				>
					SUBMIT DIAGNOSTIC FIX
				</button>
			{:else}
				<div
					class="mt-3 alert rounded-lg border-info/20 bg-info/10 p-3 text-xs alert-info text-info"
				>
					<div>
						<h4 class="text-[10px] font-bold tracking-wider uppercase">Field Fix Evaluation:</h4>
						<p class="mt-1 leading-relaxed text-base-content">{currentScenario.resolution}</p>
					</div>
				</div>

				<button
					onclick={nextScenario}
					class="btn mt-2 w-full font-mono tracking-wider btn-accent btn-xs"
				>
					NEXT SCENARIO &gt;
				</button>
			{/if}
		</div>
	</div>
</div>
