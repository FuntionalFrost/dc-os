<script lang="ts">
	import TerminalSimulator from '$lib/components/TerminalSimulator.svelte';
</script>

<div class="flex h-[calc(100vh-6.5rem)] flex-col space-y-3 font-mono">
	<!-- KVM Fullscreen Header -->
	<div class="flex shrink-0 items-center justify-between border-b border-base-200 pb-2">
		<div>
			<h1 class="text-xl font-black tracking-wider text-primary uppercase">
				📟 KVM_CONSOLE // LIVE_SHELL
			</h1>
			<p class="text-[11px] text-neutral-content">
				Full-screen interactive CLI simulator for real-time hardware diagnostics.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="badge badge-outline badge-sm font-bold badge-success">TTY1 ACTIVE</span>
			<span class="badge badge-ghost badge-sm font-bold text-neutral-content/60">BAUD 115200</span>
		</div>
	</div>

	<!-- Terminal Component Container (Fills entire remaining viewport) -->
	<div class="min-h-0 flex-1">
		<TerminalSimulator />
	</div>
</div>
