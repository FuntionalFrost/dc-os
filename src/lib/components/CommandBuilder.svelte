<script lang="ts">
	import { Terminal } from '@lucide/svelte';
	import { CodeBlock } from 'yaxa-svelte';

	let selectedCmdIndex = $state(0);

	// Clean, deeply reactive array structure
	let commands = $state([
		{
			name: 'tar',
			desc: 'Archive directories & logs securely',
			base: 'tar',
			flags: [
				{
					char: 'c',
					label: 'Create archive (-c)',
					active: true,
					desc: 'Create a new archive file'
				},
				{
					char: 'z',
					label: 'Gzip compression (-z)',
					active: true,
					desc: 'Compress archive with gzip'
				},
				{
					char: 'v',
					label: 'Verbose output (-v)',
					active: false,
					desc: 'Show detailed archiving progress'
				},
				{
					char: 'f',
					label: 'Specify archive file (-f)',
					active: true,
					desc: 'Name the output target'
				}
			],
			argPlaceholder: 'archive.tar.gz /var/log/nginx/',
			customArg: 'backup.tar.gz /var/log/syslog'
		},
		{
			name: 'ip route',
			desc: 'Display or manipulate routing tables',
			base: 'ip route',
			flags: [
				{
					char: 'show',
					label: 'Show Routing Table',
					active: true,
					desc: 'Print current active routes'
				},
				{
					char: 'add default via',
					label: 'Set Default Gateway',
					active: false,
					desc: 'Add default route (requires arg)'
				}
			],
			argPlaceholder: '192.168.1.1 dev eth0',
			customArg: ''
		}
	]);

	let activeCommand = $derived(commands[selectedCmdIndex]);

	// Svelte 5 clean derived state block (replaces the function-wrapping anti-pattern)
	let assembledCommand = $derived.by(() => {
		let cmd = activeCommand.base;
		let flagsStr = '';

		if (activeCommand.name === 'tar') {
			const activeFlags = activeCommand.flags
				.filter((f) => f.active)
				.map((f) => f.char)
				.join('');
			if (activeFlags) flagsStr = ` -${activeFlags}`;
		} else {
			flagsStr = ` ${activeCommand.flags
				.filter((f) => f.active)
				.map((f) => f.char)
				.join(' ')}`;
		}

		return `${cmd}${flagsStr} ${activeCommand.customArg || activeCommand.argPlaceholder}`
			.trim()
			.replace(/\s+/g, ' ');
	});
</script>

<div class="card border border-base-200 bg-base-100 font-mono shadow-xl">
	<div class="card-body">
		<h2 class="card-title flex items-center gap-2 text-accent">
			<Terminal class="h-5 w-5" /> Live Linux Command Architect
		</h2>
		<p class="text-sm text-neutral-content">
			Tweak switches, understand flags, and inspect your live production commands.
		</p>

		<div class="tabs-boxed tabs my-4 bg-base-200 p-1">
			{#each commands as cmd, idx (cmd.name)}
				<button
					class="tab flex-1 transition-all {selectedCmdIndex === idx
						? 'tab-active bg-primary text-primary-content'
						: 'text-base-content hover:bg-base-300'}"
					onclick={() => (selectedCmdIndex = idx)}
				>
					{cmd.name}
				</button>
			{/each}
		</div>

		<div class="space-y-3">
			<p class="text-xs font-bold tracking-wider text-base-content/60 uppercase">
				Toggle Active Flags:
			</p>

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each activeCommand.flags as flag (flag.char)}
					<label
						class="label cursor-pointer gap-4 rounded-lg border border-base-300 bg-base-200 p-3 transition-all hover:border-primary"
					>
						<span class="flex flex-col text-left">
							<span class="text-sm font-bold text-primary">{flag.label}</span>
							<span class="text-xs text-neutral-content">{flag.desc}</span>
						</span>
						<input type="checkbox" class="checkbox checkbox-primary" bind:checked={flag.active} />
					</label>
				{/each}
			</div>

			<div class="form-control mt-4 w-full">
				<span class="label text-xs font-bold text-base-content/60 uppercase">Args / Targets:</span>
				<input
					type="text"
					placeholder={activeCommand.argPlaceholder}
					bind:value={activeCommand.customArg}
					class="input-bordered input input-primary font-mono text-sm"
				/>
			</div>
		</div>

		<div class="mt-4">
			<CodeBlock
				code={assembledCommand}
				language="bash"
				filename={`${activeCommand.name} command`}
				wrap={true}
			/>
		</div>
	</div>
</div>
