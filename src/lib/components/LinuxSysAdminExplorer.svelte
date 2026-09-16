<script lang="ts">
	import { bootStages, fhsDirectories } from '$lib/data/linuxSystem';
	import { FolderTree, Terminal as TerminalIcon, HardDrive } from '@lucide/svelte';
	import {
		Tabs,
		CodeBlock,
		Timeline,
		Tree,
		type TabItem,
		type TreeNode,
		type TimelineItem
	} from 'yaxa-svelte';

	let activeTab = $state<'BOOT' | 'FHS'>('BOOT');
	let activeBootStage = $state(0);
	let selectedDirectory = $state('/proc');
	let viewMode = $state<'interactive' | 'timeline'>('interactive');

	const tabItems: TabItem[] = [
		{ value: 'BOOT', label: 'BOOT PROCESS', icon: TerminalIcon },
		{ value: 'FHS', label: 'FHS DIRECTORY MAP', icon: HardDrive }
	];

	const bootTimelineItems: TimelineItem[] = bootStages.map((stage, idx) => ({
		id: idx,
		title: `${stage.phase} - ${stage.techName}`,
		description: stage.desc,
		color: idx === 0 ? 'primary' : idx === 1 ? 'info' : idx === 2 ? 'warning' : 'success'
	}));

	const fhsTreeNodes: TreeNode[] = [
		{
			id: '/',
			label: '/ (Root Filesystem)',
			children: fhsDirectories.map((dir) => ({
				id: dir.path,
				label: `${dir.path} (${dir.name.split(' ')[0]})`
			}))
		}
	];

	let selectedDirData = $derived(
		fhsDirectories.find((d) => d.path === selectedDirectory) || fhsDirectories[0]
	);

	function handleSelectNode(node: TreeNode) {
		if (node.id !== '/') {
			selectedDirectory = node.id;
		}
	}
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-md">
	<div class="card-body p-4">
		<!-- Header Controls -->
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-base-200 pb-2">
			<h2 class="card-title flex items-center gap-1.5 text-sm font-bold text-accent uppercase">
				<FolderTree class="h-4 w-4" /> Linux System Architecture & Administration
			</h2>

			<Tabs items={tabItems} bind:value={activeTab} variant="segmented" class="text-xs" />
		</div>

		<!-- TAB 1: BOOT PROCESS -->
		{#if activeTab === 'BOOT'}
			<div class="mt-3 space-y-3">
				<div class="flex items-center justify-between">
					<div class="flex gap-1 overflow-x-auto pb-1">
						{#each bootStages as stage, idx (stage.phase)}
							<button
								onclick={() => (activeBootStage = idx)}
								class="btn btn-xs min-w-28 flex-1 font-mono transition-all {activeBootStage === idx
									? 'btn-accent font-bold text-accent-content'
									: 'btn-ghost border border-base-300 bg-base-200'}"
							>
								Stage {idx + 1}
							</button>
						{/each}
					</div>

					<button
						onclick={() => (viewMode = viewMode === 'interactive' ? 'timeline' : 'interactive')}
						class="btn btn-xs btn-outline border-base-300 font-mono text-[10px]"
					>
						{viewMode === 'interactive' ? 'SHOW TIMELINE' : 'SHOW DETAILS'}
					</button>
				</div>

				{#if viewMode === 'timeline'}
					<div class="rounded-xl border border-base-300 bg-base-200/40 p-4">
						<Timeline items={bootTimelineItems} size="sm" />
					</div>
				{:else}
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
							<div>
								<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
									>Key Diagnostic Commands</span
								>
								<CodeBlock
									code={bootStages[activeBootStage].keyCommands}
									language="bash"
									filename="commands.sh"
									wrap={true}
								/>
							</div>

							<div>
								<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
									>Target Files & Binaries</span
								>
								<CodeBlock
									code={bootStages[activeBootStage].targetFiles}
									language="bash"
									filename="target_files.txt"
									wrap={true}
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- TAB 2: FHS MAP -->
			<div class="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-12">
				<div class="space-y-2 lg:col-span-4">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
						>Filesystem Hierarchy Standard (FHS):</span
					>
					<div class="rounded-xl border border-base-300 bg-base-200/60 p-2">
						<Tree
							items={fhsTreeNodes}
							bind:selectedId={selectedDirectory}
							onselect={handleSelectNode}
							expandedIds={['/']}
							size="sm"
						/>
					</div>
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

					<div>
						<span class="mb-1 block text-[9px] font-bold text-neutral-content/60 uppercase"
							>Key Files & Virtual Nodes:</span
						>
						<CodeBlock
							code={selectedDirData.keyFiles}
							language="bash"
							filename="virtual_nodes.txt"
							wrap={true}
						/>
					</div>

					<div
						class="alert alert-warning rounded-lg border-warning/15 bg-warning/5 p-2.5 font-mono text-xs text-warning"
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
