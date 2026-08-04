<script lang="ts">
	import { pingSteps } from '$lib/data/pingSteps';
	import { Globe } from '@lucide/svelte';
	let activeStep = $state(0);

	let currentStepData = $derived(pingSteps[activeStep]);
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Globe class="h-4 w-4" /> Protocol Anatomy: "ping google.com"
			</h2>
			<span class="badge badge-xs font-bold badge-primary">DEEP PACKET FLOW</span>
		</div>

		<!-- Step Progress Bar -->
		<div class="my-3 flex gap-1 overflow-x-auto pb-1">
			{#each pingSteps as s, idx (s.step)}
				<button
					onclick={() => (activeStep = idx)}
					class="btn min-w-22.5 flex-1 font-mono transition-all btn-xs {activeStep === idx
						? 'font-bold text-primary-content btn-primary'
						: 'border border-base-300 bg-base-200 btn-ghost'}"
				>
					Step {s.step}
				</button>
			{/each}
		</div>

		<!-- Step Details View -->
		<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4">
			<div class="flex items-center justify-between border-b border-base-300 pb-2">
				<div>
					<span class="text-[10px] font-bold text-accent uppercase">{currentStepData.layer}</span>
					<h3 class="text-sm font-black text-primary uppercase">{currentStepData.title}</h3>
				</div>
				<span class="badge badge-outline text-xs badge-sm font-bold"
					>{currentStepData.protocol}</span
				>
			</div>

			<p class="text-xs leading-relaxed text-base-content">{currentStepData.desc}</p>

			<!-- Frame Payload Inspection Box -->
			<div
				class="rounded-lg border border-neutral-content/10 bg-neutral p-3 font-mono text-[11px] text-neutral-content"
			>
				<span class="mb-1 block text-[9px] font-bold text-neutral-content/50 uppercase"
					>Inspected Frame Header / Packet Payload:</span
				>
				<code class="block font-bold break-all text-accent">{currentStepData.dataPacket}</code>
			</div>
		</div>

		<!-- Controls -->
		<div class="mt-2 flex items-center justify-between">
			<button
				class="btn btn-outline font-mono btn-xs"
				onclick={() => (activeStep = Math.max(0, activeStep - 1))}
				disabled={activeStep === 0}
			>
				&lt; PREVIOUS STAGE
			</button>
			<span class="text-[10px] font-bold text-neutral-content"
				>Stage {activeStep + 1} of {pingSteps.length}</span
			>
			<button
				class="btn font-mono btn-accent btn-xs"
				onclick={() => (activeStep = Math.min(pingSteps.length - 1, activeStep + 1))}
				disabled={activeStep === pingSteps.length - 1}
			>
				NEXT STAGE &gt;
			</button>
		</div>
	</div>
</div>
