<script lang="ts">
	import CommandBuilder from '$lib/components/CommandBuilder.svelte';
	import HandsOnTroubleshooter from '$lib/components/HandsOnTroubleshooter.svelte';
	import HardwareDiagnosticSuite from '$lib/components/HardwareDiagnosticSuite.svelte';
	import LinuxSysAdminExplorer from '$lib/components/LinuxSysAdminExplorer.svelte';
</script>

<svelte:head>
	<title>Host OS &amp; Commands — RACK_COMMAND // DC-OS</title>
	<meta
		name="description"
		content="Linux boot stages, FHS directory maps, bare-metal diagnostic commands, hands-on troubleshooting scenarios, and interactive CLI generators for sysadmins."
	/>
</svelte:head>

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
		<span class="badge badge-outline badge-sm font-bold badge-primary">SYSTEMS CONSOLE</span>
	</div>

	<!-- Core Host OS & Systems Components -->
	<LinuxSysAdminExplorer />
	<HandsOnTroubleshooter />
	<HardwareDiagnosticSuite />
	<CommandBuilder />
</div>
