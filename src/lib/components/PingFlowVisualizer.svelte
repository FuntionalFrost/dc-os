<script lang="ts">
	import { pingSteps } from '$lib/data/pingSteps';
	import { Activity, Globe } from '@lucide/svelte';
	import { CodeBlock } from 'yaxa-svelte';

	let activeStep = $state(0);
	let viewMode = $state<'flow' | 'stepper'>('flow');

	let currentStepData = $derived(pingSteps[activeStep]);

	const stepThemes = [
		{
			border: 'border-cyan-500/40',
			bg: 'bg-cyan-500/10',
			text: 'text-cyan-400',
			badge: 'border-cyan-400/40 bg-cyan-500/20 text-cyan-300'
		},
		{
			border: 'border-purple-500/40',
			bg: 'bg-purple-500/10',
			text: 'text-purple-400',
			badge: 'border-purple-400/40 bg-purple-500/20 text-purple-300'
		},
		{
			border: 'border-emerald-500/40',
			bg: 'bg-emerald-500/10',
			text: 'text-emerald-400',
			badge: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300'
		},
		{
			border: 'border-sky-500/40',
			bg: 'bg-sky-500/10',
			text: 'text-sky-400',
			badge: 'border-sky-400/40 bg-sky-500/20 text-sky-300'
		},
		{
			border: 'border-amber-500/40',
			bg: 'bg-amber-500/10',
			text: 'text-amber-400',
			badge: 'border-amber-400/40 bg-amber-500/20 text-amber-300'
		},
		{
			border: 'border-teal-500/40',
			bg: 'bg-teal-500/10',
			text: 'text-teal-400',
			badge: 'border-teal-400/40 bg-teal-500/20 text-teal-300'
		},
		{
			border: 'border-green-500/40',
			bg: 'bg-green-500/10',
			text: 'text-green-400',
			badge: 'border-green-400/40 bg-green-500/20 text-green-300'
		}
	];

	let currentTheme = $derived(stepThemes[activeStep % stepThemes.length]);
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<Globe class="h-4 w-4" /> Protocol Anatomy: "ping google.com"
			</h2>
			<div class="flex items-center gap-2">
				<div class="join">
					<button
						onclick={() => (viewMode = 'flow')}
						class="btn join-item btn-xs font-mono transition-all {viewMode === 'flow'
							? 'btn-primary text-primary-content shadow-sm'
							: 'btn-ghost border border-base-300'}"
					>
						FULL FLOW
					</button>
					<button
						onclick={() => (viewMode = 'stepper')}
						class="btn join-item btn-xs font-mono transition-all {viewMode === 'stepper'
							? 'btn-primary text-primary-content shadow-sm'
							: 'btn-ghost border border-base-300'}"
					>
						INTERACTIVE STEPPER
					</button>
				</div>
				<span class="badge badge-xs badge-primary font-bold">DEEP PACKET FLOW</span>
			</div>
		</div>

		{#if viewMode === 'flow'}
			<!-- Full Packet Flow Visualizer Grid -->
			<div class="my-3 space-y-3">
				{#each pingSteps as s, idx (s.step)}
					{@const theme = stepThemes[idx % stepThemes.length]}
					<div
						class="rounded-xl border {theme.border} bg-base-200/50 p-3.5 transition-all hover:bg-base-200/80"
					>
						<div
							class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-2"
						>
							<div class="flex items-center gap-2">
								<span
									class="flex h-6 w-6 items-center justify-center rounded-lg {theme.bg} {theme.text} text-xs font-black shadow-xs"
								>
									{s.step}
								</span>
								<h3 class="text-xs font-bold text-base-content uppercase md:text-sm">
									{s.title}
								</h3>
							</div>
							<div class="flex flex-wrap items-center gap-1.5">
								<span class="rounded border px-2 py-0.5 text-[10px] font-bold {theme.badge}">
									{s.layer}
								</span>
								<span
									class="rounded border border-base-300 bg-base-300/80 px-2 py-0.5 text-[10px] font-bold text-accent"
								>
									{s.protocol}
								</span>
							</div>
						</div>

						<p class="my-2 text-xs leading-relaxed text-neutral-content">
							{s.desc}
						</p>

						<div
							class="mt-2 rounded-lg border border-base-300/80 bg-base-300/60 p-2 font-mono text-[11px]"
						>
							<div
								class="flex items-center gap-1.5 text-[10px] font-bold text-neutral-content/60 uppercase"
							>
								<Activity class="h-3 w-3 text-accent" /> Frame / Packet Payload:
							</div>
							<code class="mt-1 block text-xs font-bold break-all text-emerald-400">
								{s.dataPacket}
							</code>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Interactive Stepper Mode -->
			<div class="my-3 space-y-3">
				<!-- Step Buttons -->
				<div class="flex gap-1.5 overflow-x-auto pb-1">
					{#each pingSteps as s, idx (s.step)}
						{@const isActive = activeStep === idx}
						<button
							onclick={() => (activeStep = idx)}
							class="btn btn-xs min-w-24 flex-1 font-mono transition-all
							{isActive
								? 'btn-primary font-bold text-primary-content shadow-sm ring-1 ring-primary'
								: 'btn-ghost border border-base-300 bg-base-200'}"
						>
							Step {s.step}
						</button>
					{/each}
				</div>

				<!-- Step Details Card -->
				<div class="space-y-3 rounded-xl border {currentTheme.border} bg-base-200/70 p-4">
					<div
						class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-2"
					>
						<div class="flex items-center gap-2">
							<span
								class="flex h-7 w-7 items-center justify-center rounded-lg {currentTheme.bg} {currentTheme.text} text-sm font-black shadow-xs"
							>
								{currentStepData.step}
							</span>
							<div>
								<span class="block text-[10px] font-bold uppercase {currentTheme.text}"
									>{currentStepData.layer}</span
								>
								<h3 class="text-sm font-black text-base-content uppercase">
									{currentStepData.title}
								</h3>
							</div>
						</div>
						<span class="rounded border px-2 py-0.5 text-xs font-bold {currentTheme.badge}">
							{currentStepData.protocol}
						</span>
					</div>

					<p class="text-xs leading-relaxed text-base-content">{currentStepData.desc}</p>

					<!-- Frame Payload Box -->
					<div>
						<span class="mb-1 block text-[10px] font-bold text-neutral-content/70 uppercase">
							Inspected Frame Header / Packet Payload:
						</span>
						<CodeBlock
							code={currentStepData.dataPacket}
							language="bash"
							filename={`Step ${currentStepData.step} Frame Payload`}
							wrap={true}
						/>
					</div>
				</div>

				<!-- Stepper Navigation Controls -->
				<div class="mt-2 flex items-center justify-between pt-1">
					<button
						class="btn btn-outline btn-xs font-mono"
						onclick={() => (activeStep = Math.max(0, activeStep - 1))}
						disabled={activeStep === 0}
					>
						&lt; PREVIOUS STAGE
					</button>
					<span class="text-[10px] font-bold text-neutral-content">
						Stage {activeStep + 1} of {pingSteps.length}
					</span>
					<button
						class="btn btn-accent btn-xs font-mono"
						onclick={() => (activeStep = Math.min(pingSteps.length - 1, activeStep + 1))}
						disabled={activeStep === pingSteps.length - 1}
					>
						NEXT STAGE &gt;
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
