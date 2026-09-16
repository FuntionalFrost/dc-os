<script lang="ts">
	import { pingSteps } from '$lib/data/pingSteps';
	import { Globe } from '@lucide/svelte';
	import { Timeline, CodeBlock, type TimelineItem } from 'yaxa-svelte';

	let activeStep = $state(0);
	let viewMode = $state<'timeline' | 'stepper'>('timeline');

	let currentStepData = $derived(pingSteps[activeStep]);

	let timelineItems = $derived<TimelineItem[]>(
		pingSteps.map((s) => ({
			id: s.step,
			title: `Step ${s.step}: ${s.title}`,
			description: s.desc,
			tag: s.protocol,
			timestamp: s.layer,
			color: 'primary'
		}))
	);
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Globe class="h-4 w-4" /> Protocol Anatomy: "ping google.com"
			</h2>
			<div class="flex items-center gap-2">
				<div class="join">
					<button
						onclick={() => (viewMode = 'timeline')}
						class="btn join-item btn-xs font-mono {viewMode === 'timeline'
							? 'btn-primary text-primary-content'
							: 'btn-ghost border border-base-300'}"
					>
						TIMELINE
					</button>
					<button
						onclick={() => (viewMode = 'stepper')}
						class="btn join-item btn-xs font-mono {viewMode === 'stepper'
							? 'btn-primary text-primary-content'
							: 'btn-ghost border border-base-300'}"
					>
						STEPPER
					</button>
				</div>
				<span class="badge badge-xs badge-primary font-bold">DEEP PACKET FLOW</span>
			</div>
		</div>

		{#if viewMode === 'timeline'}
			<div class="my-3 space-y-4">
				<Timeline items={timelineItems} size="sm" class="pl-2" />
			</div>
		{:else}
			<!-- Step Progress Bar -->
			<div class="my-3 flex gap-1 overflow-x-auto pb-1">
				{#each pingSteps as s, idx (s.step)}
					<button
						onclick={() => (activeStep = idx)}
						class="btn btn-xs min-w-22.5 flex-1 font-mono transition-all {activeStep === idx
							? 'btn-primary font-bold text-primary-content'
							: 'btn-ghost border border-base-300 bg-base-200'}"
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
					<span class="badge badge-outline badge-sm text-xs font-bold"
						>{currentStepData.protocol}</span
					>
				</div>

				<p class="text-xs leading-relaxed text-base-content">{currentStepData.desc}</p>

				<!-- Frame Payload Inspection Box with CodeBlock -->
				<div>
					<span class="mb-1 block text-[9px] font-bold text-neutral-content/60 uppercase"
						>Inspected Frame Header / Packet Payload:</span
					>
					<CodeBlock
						code={currentStepData.dataPacket}
						language="bash"
						filename={`Step ${currentStepData.step} Frame Payload`}
						wrap={true}
					/>
				</div>
			</div>

			<!-- Controls -->
			<div class="mt-2 flex items-center justify-between">
				<button
					class="btn btn-outline btn-xs font-mono"
					onclick={() => (activeStep = Math.max(0, activeStep - 1))}
					disabled={activeStep === 0}
				>
					&lt; PREVIOUS STAGE
				</button>
				<span class="text-[10px] font-bold text-neutral-content"
					>Stage {activeStep + 1} of {pingSteps.length}</span
				>
				<button
					class="btn btn-accent btn-xs font-mono"
					onclick={() => (activeStep = Math.min(pingSteps.length - 1, activeStep + 1))}
					disabled={activeStep === pingSteps.length - 1}
				>
					NEXT STAGE &gt;
				</button>
			</div>
		{/if}
	</div>
</div>
