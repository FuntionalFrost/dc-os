<script lang="ts">
	import { Terminal } from '@lucide/svelte';
	import { CodeBlock } from 'yaxa-svelte';

	let selectedCmdIndex = $state(0);

	interface CommandFlag {
		char: string;
		label: string;
		active: boolean;
		desc: string;
	}

	interface BuilderCommand {
		name: string;
		desc: string;
		base: string;
		groupedFlags?: boolean;
		flags: CommandFlag[];
		argPlaceholder: string;
		customArg: string;
	}

	// Clean, deeply reactive array structure
	let commands = $state<BuilderCommand[]>([
		{
			name: 'ssh',
			desc: 'Remote login into data center nodes via SSH',
			base: 'ssh',
			groupedFlags: false,
			flags: [
				{
					char: '-p 2222',
					label: 'Custom Port (-p 2222)',
					active: false,
					desc: 'Connect to non-standard SSH port'
				},
				{
					char: '-i ~/.ssh/id_ed25519',
					label: 'Identity Key (-i)',
					active: true,
					desc: 'Authenticate using specific private key'
				},
				{
					char: '-C',
					label: 'Enable Compression (-C)',
					active: true,
					desc: 'Compress data stream for high latency WAN links'
				},
				{
					char: '-v',
					label: 'Verbose Debug (-v)',
					active: false,
					desc: 'Print handshake and authentication debug logs'
				},
				{
					char: '-X',
					label: 'X11 Forwarding (-X)',
					active: false,
					desc: 'Tunnel remote GUI apps to local display server'
				}
			],
			argPlaceholder: 'sysadmin@10.240.0.45',
			customArg: 'sysadmin@10.240.0.45'
		},
		{
			name: 'ssh tunnel',
			desc: 'Local, Remote, or Dynamic SOCKS5 Port Forwarding',
			base: 'ssh',
			groupedFlags: false,
			flags: [
				{
					char: '-L 8080:10.240.0.50:80',
					label: 'Local Forward (-L 8080:target:80)',
					active: true,
					desc: 'Forward local port 8080 to internal server port 80'
				},
				{
					char: '-R 9000:localhost:3000',
					label: 'Remote / Reverse Forward (-R)',
					active: false,
					desc: 'Expose local port 3000 to remote server port 9000'
				},
				{
					char: '-D 1080',
					label: 'Dynamic SOCKS5 Proxy (-D 1080)',
					active: false,
					desc: 'Route web browser traffic through remote host'
				},
				{
					char: '-N',
					label: 'No Remote Shell (-N)',
					active: true,
					desc: 'Do not execute a remote command; forward ports only'
				},
				{
					char: '-f',
					label: 'Background Fork (-f)',
					active: false,
					desc: 'Go to background immediately before command execution'
				}
			],
			argPlaceholder: 'sysadmin@bastion.dc.net',
			customArg: 'sysadmin@bastion.dc.net'
		},
		{
			name: 'ss',
			desc: 'Inspect open listening sockets and active connections',
			base: 'ss',
			groupedFlags: true,
			flags: [
				{
					char: 't',
					label: 'TCP Sockets (-t)',
					active: true,
					desc: 'Display TCP socket streams'
				},
				{
					char: 'u',
					label: 'UDP Sockets (-u)',
					active: true,
					desc: 'Display UDP datagram sockets'
				},
				{
					char: 'l',
					label: 'Listening Only (-l)',
					active: true,
					desc: 'Filter for actively listening service daemons'
				},
				{
					char: 'p',
					label: 'Process Info (-p)',
					active: true,
					desc: 'Show process PID and binary name (requires sudo)'
				},
				{
					char: 'n',
					label: 'Numeric Ports & IPs (-n)',
					active: true,
					desc: 'Prevent slow reverse DNS and service name lookups'
				}
			],
			argPlaceholder: '(optional filter, e.g. sport = :22)',
			customArg: ''
		},
		{
			name: 'sudo',
			desc: 'Execute commands with superuser privileges or switch context',
			base: 'sudo',
			groupedFlags: false,
			flags: [
				{
					char: '-i',
					label: 'Login Shell (-i)',
					active: false,
					desc: 'Simulate full login as root (sources /root/.bashrc)'
				},
				{
					char: '-l',
					label: 'List Privileges (-l)',
					active: false,
					desc: 'List allowed and forbidden commands for user'
				},
				{
					char: '-E',
					label: 'Preserve Environment (-E)',
					active: false,
					desc: 'Preserves existing environment variables'
				},
				{
					char: '-u www-data',
					label: 'Run as User (-u www-data)',
					active: false,
					desc: 'Execute command as specific user rather than root'
				}
			],
			argPlaceholder: 'systemctl restart nginx',
			customArg: 'systemctl restart nginx'
		},
		{
			name: 'df',
			desc: 'Audit disk filesystem capacity and inode consumption',
			base: 'df',
			groupedFlags: true,
			flags: [
				{
					char: 'h',
					label: 'Human-Readable (-h)',
					active: true,
					desc: 'Print sizes in powers of 1024 (e.g. 10G, 500M)'
				},
				{
					char: 'T',
					label: 'Print FSType (-T)',
					active: true,
					desc: 'Show filesystem type (ext4, xfs, zfs, btrfs)'
				},
				{
					char: 'i',
					label: 'Inodes Count (-i)',
					active: false,
					desc: 'Show free and used inodes instead of block storage'
				},
				{
					char: 'a',
					label: 'All Filesystems (-a)',
					active: false,
					desc: 'Include dummy, virtual, and pseudo filesystems'
				}
			],
			argPlaceholder: '(optional mount point, e.g. / /var)',
			customArg: ''
		},
		{
			name: 'tar',
			desc: 'Archive directories & logs securely',
			base: 'tar',
			groupedFlags: true,
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
			groupedFlags: false,
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

	// Svelte 5 clean derived state block
	let assembledCommand = $derived.by(() => {
		const cmd = activeCommand.base;
		let flagsStr = '';

		if (activeCommand.groupedFlags) {
			const activeChars = activeCommand.flags
				.filter((f) => f.active)
				.map((f) => f.char)
				.join('');
			if (activeChars) flagsStr = ` -${activeChars}`;
		} else {
			const activeFlags = activeCommand.flags
				.filter((f) => f.active)
				.map((f) => f.char)
				.join(' ');
			if (activeFlags) flagsStr = ` ${activeFlags}`;
		}

		const arg = (activeCommand.customArg || activeCommand.argPlaceholder || '')
			.replace(/\(.*?\)/g, '')
			.trim();

		return `${cmd}${flagsStr} ${arg}`.trim().replace(/\s+/g, ' ');
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

		<div class="my-4 flex flex-wrap items-center gap-1 rounded-lg bg-base-200 p-1">
			{#each commands as cmd, idx (cmd.name)}
				<button
					class="cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all {selectedCmdIndex ===
					idx
						? 'bg-primary font-bold text-primary-content shadow-sm'
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
