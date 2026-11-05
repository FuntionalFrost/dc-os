<script lang="ts">
	import PageHeader from '#lib/components/PageHeader.svelte';
	import SEO from '#lib/components/SEO.svelte';
	import CommandBuilder from '#lib/components/CommandBuilder.svelte';
	import HandsOnTroubleshooter from '#lib/components/HandsOnTroubleshooter.svelte';
	import HardwareDiagnosticSuite from '#lib/components/HardwareDiagnosticSuite.svelte';
	import LinuxSysAdminExplorer from '#lib/components/LinuxSysAdminExplorer.svelte';
</script>

<SEO
	title="Host OS & Bare Metal Diagnostics"
	description="Linux boot stages (UEFI/GRUB/kernel/systemd), FHS map, remote workstation SSH workflow, port forwarding tunnels, open socket inspection (ss/lsof), sudo privileges, and df -h storage diagnostics."
	path="/cheat-sheet"
	keywords={[
		'linux boot stages guide',
		'fhs directory map sysadmin',
		'systemd boot sequence',
		'ssh port forwarding local remote dynamic',
		'ss tulpn listening ports',
		'lsof open sockets',
		'sudo vs sudo su vs sudo -i',
		'df -h inode exhaustion df -i',
		'bare metal server diagnostics',
		'linux sysadmin cheat sheet',
		'workstation to server remoting guide',
		'tar command builder',
		'ip route syntax generator'
	]}
/>

<div class="space-y-6 font-mono">
	<!-- Clean Single Route Header -->
	<PageHeader
		title="💻 HOST_OS // BARE_METAL_DIAGS"
		description="Host administration, boot stages, hardware inventory tools, and interactive CLI generators."
		badge="SYSTEMS CONSOLE"
	/>

	<!-- Core Host OS & Systems Components -->
	<LinuxSysAdminExplorer />
	<HandsOnTroubleshooter />
	<HardwareDiagnosticSuite />
	<CommandBuilder />
</div>
