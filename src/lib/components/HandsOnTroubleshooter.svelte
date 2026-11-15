<script lang="ts">
	import { Wrench } from '@lucide/svelte';
	import { Badge, CodeDiff, Kbd } from 'yaxa-svelte';

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
				"CRC errors indicate physical bit corruption occurring on the wire or optical core. Dirty fiber end-faces diffuse laser light, causing bit flips. Cleaning the bulkhead and checking 'ethtool -m' DOM optical power fixes 90% of flapping links.",
			diff: {
				filename: 'ethtool -m eth1 (DOM Optical Diagnostics)',
				language: 'yaml',
				original: `# Dirty LC Bulkhead with dust contamination
Receiver signal average optical power: -19.42 dBm (Alarm Low)
Laser bias current: 7.21 mA
Link status: DOWN (flapping 30s cycle)
rx_crc_errors: 48921`,
				modified: `# Bulkhead cleaned with one-click pen & re-seated
Receiver signal average optical power: -3.85 dBm (Nominal)
Laser bias current: 7.25 mA
Link status: UP (10000baseT/Full)
rx_crc_errors: 0`
			}
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
				"The 'Unable to mount root fs' panic occurs when the kernel executes before storage drivers are available in memory, pointing to a corrupted or missing initramfs image. Regenerating initramfs fixes the driver tree.",
			diff: {
				filename: '/boot/grub/grub.cfg (Kernel Boot Entry)',
				language: 'bash',
				original: `# Failing Entry: missing initrd driver image
menuentry 'Ubuntu, Linux 6.8.0-generic' {
    linux /vmlinuz-6.8.0-generic root=/dev/sda1 ro
    # VFS Error: unable to mount root fs
}`,
				modified: `# Fixed Entry: initramfs restored via recovery
menuentry 'Ubuntu, Linux 6.8.0-generic' {
    linux /vmlinuz-6.8.0-generic root=UUID=8b34c11b-9f62-421b ro quiet
    initrd /initrd.img-6.8.0-generic
}`
			}
		},
		{
			title: 'Scenario C: Emergency Mode on Persistent Storage Mount',
			setup:
				"Following a reboot after replacing an SSD drive bay, a production node fails to boot and drops into: 'Welcome to emergency mode! Run journalctl -xb to view system logs'. Storage logs show a timeout waiting for /dev/sdb1.",
			options: [
				'Delete the /etc directory and reboot',
				'Edit /etc/fstab to use persistent device UUID rather than volatile /dev/sdX names and append the nofail option',
				'Execute mkfs.ext4 on /dev/sda1 to wipe the boot partition',
				'Run chmod -R 777 / to restore filesystem access'
			],
			correct: 1,
			resolution:
				"Kernel device enumeration for /dev/sdX drives is non-deterministic and can reorder during hardware swaps. Always mount filesystems in /etc/fstab by persistent UUID (via 'blkid') and use 'nofail' on non-root drives to prevent emergency boot halt.",
			diff: {
				filename: '/etc/fstab (Filesystem Mount Table)',
				language: 'bash',
				original: `# Faulty: Volatile kernel path failed enumeration
/dev/sdb1  /mnt/data  ext4  defaults  0  2`,
				modified: `# Fixed: Stable persistent UUID with nofail safety
UUID=8f7e2a1b-3c4d-5e6f-7a8b-9c0d1e2f3a4b  /mnt/data  ext4  defaults,nofail  0  2`
			}
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
			<Badge variant="subtle" color="warning" size="xs">PRACTICAL SCENARIO</Badge>
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
						class="flex w-full items-center gap-3 rounded-lg border p-2.5 text-left font-mono text-xs transition-all
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
						<Kbd size="xs">{idx + 1}</Kbd>
						<span class="flex-1">{option}</span>
					</button>
				{/each}
			</div>

			{#if !evaluated}
				<button
					onclick={evaluateChoice}
					disabled={userChoice === null}
					class="btn btn-xs mt-2 w-full font-mono tracking-wider transition-all {userChoice !== null
						? 'btn-primary shadow-sm'
						: 'btn-ghost border border-base-300 opacity-60'}"
				>
					{userChoice !== null ? 'SUBMIT DIAGNOSTIC FIX' : 'SELECT AN OPTION ABOVE TO SUBMIT'}
				</button>
			{:else}
				<div
					class="alert alert-info mt-3 rounded-lg border-info/20 bg-info/10 p-3 text-xs text-info"
				>
					<div>
						<h4 class="text-[10px] font-bold tracking-wider uppercase">Field Fix Evaluation:</h4>
						<p class="mt-1 leading-relaxed text-base-content">{currentScenario.resolution}</p>
					</div>
				</div>

				{#if currentScenario.diff}
					<div class="mt-3 space-y-1">
						<div class="text-[10px] font-bold tracking-wider text-neutral-content/70 uppercase">
							Remediation Configuration Diff:
						</div>
						<div class="overflow-hidden rounded-xl border border-base-300">
							<CodeDiff
								original={currentScenario.diff.original}
								modified={currentScenario.diff.modified}
								language={currentScenario.diff.language}
								filename={currentScenario.diff.filename}
								viewMode="unified"
								showLineNumbers={true}
							/>
						</div>
					</div>
				{/if}

				<button
					onclick={nextScenario}
					class="btn btn-accent btn-xs mt-2 w-full font-mono tracking-wider"
				>
					NEXT SCENARIO &gt;
				</button>
			{/if}
		</div>
	</div>
</div>
