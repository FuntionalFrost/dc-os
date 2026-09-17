<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CommandBuilder from '$lib/components/CommandBuilder.svelte';
	import HandsOnTroubleshooter from '$lib/components/HandsOnTroubleshooter.svelte';
	import HardwareDiagnosticSuite from '$lib/components/HardwareDiagnosticSuite.svelte';
	import LinuxSysAdminExplorer from '$lib/components/LinuxSysAdminExplorer.svelte';
</script>

<SEO
	title="Host OS & Bare Metal Diagnostics"
	description="Linux boot stages (UEFI/GRUB/kernel/systemd), Filesystem Hierarchy Standard (FHS) map, bare-metal diagnostic commands, and hands-on sysadmin incident simulator."
	path="/cheat-sheet"
	keywords={[
		'linux boot stages guide',
		'fhs directory map sysadmin',
		'systemd boot sequence',
		'initramfs kernel mount troubleshooting',
		'bare metal server diagnostics',
		'linux sysadmin cheat sheet',
		'tar command builder',
		'ip route syntax generator'
	]}
/>

<div class="space-y-6 font-mono">
	<!-- Clean Single Route Header -->
	<div class="flex items-center justify-between border-b border-base-200 pb-3">
		<div>
			<h1 class="text-2xl font-black tracking-wider text-primary uppercase">
				💻 HOST_OS // BARE_METAL_DIAGS
			</h1>
			<p class="mt-1 text-xs text-neutral-content">
				Host administration, boot stages, hardware inventory tools, and interactive CLI generators.
			</p>
		</div>
		<span class="badge badge-outline badge-sm badge-primary font-bold">SYSTEMS CONSOLE</span>
	</div>

	<!-- Core Host OS & Systems Components -->
	<LinuxSysAdminExplorer />
	<HandsOnTroubleshooter />
	<HardwareDiagnosticSuite />
	<CommandBuilder />
</div>
