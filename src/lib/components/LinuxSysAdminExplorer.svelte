<script lang="ts">
	import {
		bootStages,
		fhsDirectories,
		remotingWorkflow,
		portForwardingModes,
		portInspectionTools,
		privilegeGuides,
		basicUserCommands,
		storageDiagnosticTips
	} from '#lib/data/linuxSystem.js';
	import {
		FolderTree,
		Terminal as TerminalIcon,
		HardDrive,
		Network,
		ShieldCheck,
		Server,
		ArrowRight
	} from '@lucide/svelte';
	import {
		Tabs,
		CodeBlock,
		Timeline,
		Tree,
		Badge,
		type TabItem,
		type TreeNode,
		type TimelineItem
	} from 'yaxa-svelte';

	type AdminTab = 'BOOT' | 'FHS' | 'REMOTING' | 'PORTS' | 'PRIVILEGE' | 'STORAGE';

	let activeTab = $state<AdminTab>('BOOT');
	let activeBootStage = $state(0);
	let selectedDirectory = $state('/proc');
	let viewMode = $state<'interactive' | 'timeline'>('interactive');

	let activeRemotingStep = $state(0);
	let activeForwardingMode = $state(0);
	let activePortTool = $state(0);

	const tabItems: TabItem[] = [
		{ value: 'BOOT', label: 'BOOT PROCESS', icon: TerminalIcon },
		{ value: 'FHS', label: 'FHS MAP', icon: HardDrive },
		{ value: 'REMOTING', label: 'REMOTING & SSH', icon: Server },
		{ value: 'PORTS', label: 'PORTS & TUNNELING', icon: Network },
		{ value: 'PRIVILEGE', label: 'SUDO & USERS', icon: ShieldCheck },
		{ value: 'STORAGE', label: 'STORAGE (DF -H)', icon: HardDrive }
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
		{:else if activeTab === 'FHS'}
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
		{:else if activeTab === 'REMOTING'}
			<!-- TAB 3: LOCAL TO REMOTE WORKSTATION WORKFLOW -->
			<div class="mt-3 space-y-4">
				<div
					class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-2"
				>
					<div>
						<span class="text-[10px] font-bold text-accent uppercase"
							>Workstation To Data Center</span
						>
						<h3 class="text-sm font-bold text-primary uppercase">
							End-to-End Remoting Workflow & Architecture
						</h3>
					</div>
					<Badge variant="subtle" color="primary" size="xs">SECURE SHELL & IPMI</Badge>
				</div>

				<!-- Step Switcher -->
				<div class="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
					{#each remotingWorkflow as step, idx (step.step)}
						<button
							onclick={() => (activeRemotingStep = idx)}
							class="btn btn-xs flex flex-col items-center justify-center py-2 font-mono transition-all {activeRemotingStep ===
							idx
								? 'btn-primary font-bold text-primary-content shadow'
								: 'btn-ghost border border-base-300 bg-base-200'}"
						>
							<span class="text-[9px] opacity-75">STEP 0{step.step}</span>
							<span class="truncate text-[10px]">{step.title.split(' ')[0]}</span>
						</button>
					{/each}
				</div>

				<!-- Active Step Card -->
				{#each [remotingWorkflow[activeRemotingStep]] as currStep (currStep.step)}
					<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4">
						<div
							class="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-2"
						>
							<div>
								<span class="text-[10px] font-bold text-accent uppercase"
									>Step 0{currStep.step}: {currStep.concept}</span
								>
								<h4 class="text-sm font-black text-primary uppercase">{currStep.title}</h4>
							</div>
							<span class="badge badge-accent badge-sm text-[10px] font-bold">PRODUCTION READY</span
							>
						</div>

						<p class="text-xs leading-relaxed text-base-content">{currStep.explanation}</p>

						<div>
							<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
								>Terminal Execution Syntax:</span
							>
							<CodeBlock
								code={currStep.command}
								language="bash"
								filename={`remoting_step_${currStep.step}.sh`}
								wrap={true}
							/>
						</div>

						<div
							class="alert alert-info rounded-lg border-info/20 bg-info/5 p-2.5 font-mono text-xs text-info"
						>
							<span class="block text-[9px] font-bold text-accent uppercase"
								>Operational Security Rule:</span
							>
							<p class="text-[11px] leading-normal text-base-content">{currStep.tip}</p>
						</div>
					</div>
				{/each}

				<!-- Workflow Progression Strip -->
				<div
					class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-base-300 bg-base-200/40 p-3 text-[11px]"
				>
					<div class="flex items-center gap-1 font-bold text-primary">
						<span>1. Keygen</span>
						<ArrowRight class="h-3 w-3 text-neutral-content/40" />
					</div>
					<div class="flex items-center gap-1 font-bold text-primary">
						<span>2. SSH Agent</span>
						<ArrowRight class="h-3 w-3 text-neutral-content/40" />
					</div>
					<div class="flex items-center gap-1 font-bold text-primary">
						<span>3. Authorized Keys</span>
						<ArrowRight class="h-3 w-3 text-neutral-content/40" />
					</div>
					<div class="flex items-center gap-1 font-bold text-primary">
						<span>4. Bastion ProxyJump</span>
						<ArrowRight class="h-3 w-3 text-neutral-content/40" />
					</div>
					<div class="flex items-center gap-1 font-bold text-accent">
						<span>5. IPMI SoL Console</span>
					</div>
				</div>
			</div>
		{:else if activeTab === 'PORTS'}
			<!-- TAB 4: PORT FORWARDING & OPEN PORTS -->
			<div class="mt-3 space-y-4">
				<div class="border-b border-base-300 pb-2">
					<span class="text-[10px] font-bold text-accent uppercase">Networking & Sockets</span>
					<h3 class="text-sm font-bold text-primary uppercase">
						SSH Port Forwarding & Listening Socket Diagnostics
					</h3>
				</div>

				<!-- Section A: Port Forwarding Modes -->
				<div class="space-y-3">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
						>1. SSH Tunneling Modes (-L, -R, -D):</span
					>
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
						{#each portForwardingModes as mode, idx (mode.mode)}
							<button
								onclick={() => (activeForwardingMode = idx)}
								class="rounded-lg border p-3 text-left transition-all {activeForwardingMode === idx
									? 'border-primary bg-primary/10 shadow-sm'
									: 'border-base-300 bg-base-200 hover:border-primary/50'}"
							>
								<div class="text-xs font-black text-primary uppercase">{mode.mode}</div>
								<div class="mt-1 text-[10px] leading-tight text-neutral-content">
									{mode.useCase}
								</div>
							</button>
						{/each}
					</div>

					{#each [portForwardingModes[activeForwardingMode]] as fwd (fwd.mode)}
						<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4">
							<div class="flex items-center justify-between border-b border-base-300 pb-2">
								<div>
									<span class="text-[10px] font-bold text-accent uppercase">Directional Flow:</span>
									<h4 class="text-xs font-black text-primary">{fwd.direction}</h4>
								</div>
								<Badge variant="subtle" color="info" size="xs">{fwd.mode}</Badge>
							</div>

							<p class="text-xs leading-relaxed text-base-content">{fwd.explanation}</p>

							<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
								<div>
									<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
										>Command Syntax:</span
									>
									<CodeBlock code={fwd.syntax} language="bash" filename="syntax.sh" wrap={true} />
								</div>
								<div>
									<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
										>Production Example:</span
									>
									<CodeBlock code={fwd.example} language="bash" filename="example.sh" wrap={true} />
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Section B: Listening Port Tools -->
				<div class="space-y-3 pt-2">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
						>2. Identifying Open & Listening Ports (ss, lsof, netcat):</span
					>
					<div class="flex gap-2 overflow-x-auto pb-1">
						{#each portInspectionTools as tool, idx (tool.tool)}
							<button
								onclick={() => (activePortTool = idx)}
								class="btn btn-xs font-mono transition-all {activePortTool === idx
									? 'btn-accent font-bold text-accent-content'
									: 'btn-ghost border border-base-300 bg-base-200'}"
							>
								{tool.tool.split(' ')[0]}
							</button>
						{/each}
					</div>

					{#each [portInspectionTools[activePortTool]] as tool (tool.tool)}
						<div class="space-y-3 rounded-xl border border-base-300 bg-base-200/60 p-4">
							<div class="flex items-center justify-between border-b border-base-300 pb-2">
								<div>
									<span class="text-[10px] font-bold text-accent uppercase">{tool.tool}</span>
									<h4 class="text-xs font-bold text-primary">{tool.purpose}</h4>
								</div>
								<code class="rounded bg-base-300 px-2 py-0.5 text-xs font-bold text-accent"
									>{tool.command}</code
								>
							</div>

							<div class="rounded-lg border border-base-300 bg-base-300/40 p-2.5 text-xs">
								<span class="mb-1 block text-[9px] font-bold text-accent uppercase"
									>Flag Breakdown:</span
								>
								<p class="text-[11px] text-base-content">{tool.flagBreakdown}</p>
							</div>

							<div>
								<span class="mb-1 block text-[9px] font-bold text-neutral-content/60 uppercase"
									>Real Production Terminal Output:</span
								>
								<CodeBlock
									code={tool.sampleOutput}
									language="bash"
									filename="ports_terminal.txt"
									wrap={true}
								/>
							</div>

							<div
								class="alert alert-warning rounded-lg border-warning/15 bg-warning/5 p-2.5 font-mono text-xs text-warning"
							>
								<span class="block text-[9px] font-bold text-accent uppercase">Field Insight:</span>
								<p class="text-[11px] leading-normal text-base-content">{tool.interviewTip}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'PRIVILEGE'}
			<!-- TAB 5: SUDO & USER MANAGEMENT -->
			<div class="mt-3 space-y-4">
				<div class="border-b border-base-300 pb-2">
					<span class="text-[10px] font-bold text-accent uppercase"
						>Privilege Escalation & Identity</span
					>
					<h3 class="text-sm font-bold text-primary uppercase">
						Sudo Variations (sudo vs sudo -i vs sudo su) & User Commands
					</h3>
				</div>

				<!-- Privilege Table / Cards -->
				<div class="space-y-2">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
						>Superuser Escalation Comparison:</span
					>
					<div class="grid grid-cols-1 gap-2.5 md:grid-cols-2">
						{#each privilegeGuides as item (item.command)}
							<div class="space-y-2 rounded-xl border border-base-300 bg-base-200/60 p-3">
								<div class="flex items-center justify-between border-b border-base-300 pb-1.5">
									<code class="rounded bg-primary/15 px-2 py-0.5 text-xs font-black text-primary">
										{item.command}
									</code>
									<Badge
										variant="subtle"
										color={item.riskLevel === 'LOW'
											? 'success'
											: item.riskLevel === 'MEDIUM'
												? 'warning'
												: 'error'}
										size="xs"
									>
										{item.riskLevel} RISK
									</Badge>
								</div>
								<h4 class="text-xs font-bold text-accent">{item.title}</h4>
								<p class="text-[11px] leading-relaxed text-base-content">{item.mechanism}</p>
								<div class="rounded border border-base-300 bg-base-300/40 p-2 text-[10px]">
									<span class="font-bold text-neutral-content/80">Environment: </span>
									<span class="text-base-content">{item.envBehavior}</span>
								</div>
								<p class="text-[10px] text-neutral-content/70 italic">
									<strong class="text-primary not-italic">Rule:</strong>
									{item.bestPractice}
								</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Basic User Commands -->
				<div class="space-y-2 pt-2">
					<span class="block text-[10px] font-bold text-neutral-content/60 uppercase"
						>Basic User & Session Management Commands:</span
					>
					<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{#each basicUserCommands as cmd (cmd.name)}
							<div class="space-y-1.5 rounded-lg border border-base-300 bg-base-200/40 p-3">
								<div class="flex items-center justify-between">
									<span class="text-xs font-black text-primary">{cmd.name}</span>
									<code class="text-[10px] text-accent">{cmd.syntax}</code>
								</div>
								<p class="text-[11px] text-base-content">{cmd.purpose}</p>
								<div class="rounded bg-base-300/60 p-1.5 font-mono text-[9px] text-neutral-content">
									{cmd.outputExample}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'STORAGE'}
			<!-- TAB 6: STORAGE & INODES (DF -H) -->
			<div class="mt-3 space-y-4">
				<div class="border-b border-base-300 pb-2">
					<span class="text-[10px] font-bold text-accent uppercase"
						>Filesystem Space & Capacity</span
					>
					<h3 class="text-sm font-bold text-primary uppercase">
						Disk Usage (df -h), Inode Exhaustion (df -i), and Deleted File Handles
					</h3>
				</div>

				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					{#each storageDiagnosticTips as tip (tip.command)}
						<div class="space-y-2.5 rounded-xl border border-base-300 bg-base-200/60 p-4">
							<div class="flex items-center justify-between border-b border-base-300 pb-2">
								<h4 class="text-xs font-black text-primary uppercase">{tip.purpose}</h4>
								<code class="rounded bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
									{tip.command}
								</code>
							</div>

							<p class="text-xs leading-relaxed text-base-content">{tip.explanation}</p>

							<div
								class="alert alert-warning rounded-lg border-warning/15 bg-warning/5 p-2.5 font-mono text-xs text-warning"
							>
								<span class="block text-[9px] font-bold text-accent uppercase"
									>Critical Interview Insight:</span
								>
								<p class="text-[11px] leading-normal text-base-content">{tip.interviewInsight}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
