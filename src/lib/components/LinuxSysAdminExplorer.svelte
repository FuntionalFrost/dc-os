<script lang="ts">
	import { bootStages, fhsDirectories } from '$lib/data/linuxSystem';
	import { FolderTree } from '@lucide/svelte';

	let activeTab = $state<'FHS' | 'BOOT'>('BOOT');
	let activeBootStage = $state(0);
	let selectedDirectory = $state('/proc');

	let selectedDirData = $derived(fhsDirectories.find((d) => d.path === selectedDirectory)!);
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<!-- Header Controls -->
		<div class="flex items-center justify-between border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<FolderTree class="h-4 w-4" /> Linux System Architecture & Administration
			</h2>

			<div class="join">
				<button
					onclick={() => (activeTab = 'BOOT')}
					class="btn join-item font-mono btn-xs {activeTab === 'BOOT'
						? 'text-primary-content btn-primary'
						: 'border-base-300 btn-outline'}"
				>
					BOOT PROCESS
				</button>
				<button
					onclick={() => (activeTab = 'FHS')}
					class="btn join-item font-mono btn-xs {activeTab === 'FHS'
						? 'text-primary-content btn-primary'
						: 'border-base-300 btn-outline'}"
				>
					FHS DIRECTORY MAP
				</button>
			</div>
		</div>

		<!-- TAB 1: BOOT PROCESS -->
		{#if activeTab === 'BOOT'}
			<div class="mt-2 space-y-3">
				<div class="flex gap-1 overflow-x-auto pb-1">
					{#each bootStages as stage, idx (stage.phase)}
						<button
							onclick={() => (activeBootStage = idx)}
							class="btn min-w-30 flex-1 font-mono transition-all btn-xs {activeBootStage === idx
								? 'font-bold text-accent-content btn-accent'
								: 'border border-base-300 bg-base-200 btn-ghost'}"
						>
							Stage {idx + 1}
						</button>
					{/each}
				</div>

				<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4">
					<div class="flex items-center justify-between border-b border-base-300 pb-2">
						<div>
							<span class="text-[10px] font-bold text-accent uppercase"
								>{bootStages[activeBootStage].phase}</span
							>
							<h3 class="text-sm font-black text-primary uppercase">
								{bootStages[activeBootStage].techName}
							</h3>
						</div>
						<span class="badge badge-outline badge-sm text-[10px] font-bold">BOOT SEQUENCE</span>
					</div>

					<p class="text-xs leading-relaxed text-base-content">
						{bootStages[activeBootStage].desc}
					</p>

					<div class="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
						<div class="rounded border border-base-200 bg-base-300 p-2.5">
							<span class="block text-[9px] font-bold text-accent uppercase"
								>Key Diagnostic Commands</span
							>
							<code class="mt-1 block text-xs font-bold text-primary"
								>{bootStages[activeBootStage].keyCommands}</code
							>
						</div>

						<div class="rounded border border-base-200 bg-base-300 p-2.5">
							<span class="block text-[9px] font-bold text-accent uppercase"
								>Target Files & Binaries</span
							>
							<code class="mt-1 block text-xs font-bold text-base-content"
								>{bootStages[activeBootStage].targetFiles}</code
							>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- TAB 2: FHS MAP -->
			<div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div class="flex flex-col gap-1 lg:col-span-4">
					<span class="mb-1 block text-[10px] font-bold text-neutral-content/60 uppercase"
						>Select Path:</span
					>
					{#each fhsDirectories as dir (dir.path)}
						<button
							onclick={() => (selectedDirectory = dir.path)}
							class="btn h-9 justify-start font-mono transition-all btn-xs {selectedDirectory ===
							dir.path
								? 'font-bold text-primary-content btn-primary'
								: 'border border-base-300 bg-base-200 btn-ghost'}"
						>
							<span class="text-xs">{dir.path} - {dir.name.split(' ')[0]}</span>
						</button>
					{/each}
				</div>

				<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4 lg:col-span-8">
					<div class="flex items-center justify-between border-b border-base-300 pb-2">
						<div>
							<span class="text-[10px] font-bold text-accent uppercase">{selectedDirData.type}</span
							>
							<h3 class="text-sm font-black text-primary uppercase">
								{selectedDirData.path} : {selectedDirData.name}
							</h3>
						</div>
					</div>

					<p class="text-xs leading-relaxed text-base-content">{selectedDirData.desc}</p>

					<div
						class="rounded-lg border border-neutral-content/10 bg-neutral p-3 font-mono text-xs text-neutral-content"
					>
						<span class="mb-1 block text-[9px] font-bold text-neutral-content/50 uppercase"
							>Key Files & Virtual Nodes:</span
						>
						<code class="block font-bold text-accent">{selectedDirData.keyFiles}</code>
					</div>

					<div
						class="alert rounded-lg border-warning/15 bg-warning/5 p-2.5 font-mono text-xs alert-warning text-warning"
					>
						<span class="block text-[9px] font-bold text-accent uppercase"
							>SysAdmin Interview Insight:</span
						>
						<p class="text-[11px] leading-normal text-base-content">
							{selectedDirData.interviewTip}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
