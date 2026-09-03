<script lang="ts">
	import { mockResponses } from '$lib/data/mockTerminalResponses';
	import { RefreshCw, Terminal as TerminalIcon } from '@lucide/svelte';
	import { FitAddon } from '@xterm/addon-fit';
	import { Terminal } from '@xterm/xterm';
	import '@xterm/xterm/css/xterm.css';
	import { onDestroy, onMount } from 'svelte';

	let { initialCommand = '' } = $props<{ initialCommand?: string }>();

	let terminalElement = $state<HTMLDivElement | null>(null);
	let term: Terminal | null = null;
	let fitAddon: FitAddon | null = null;

	let inputBuffer = '';
	let commandHistory: string[] = [];
	let historyIndex = -1;

	function printPrompt() {
		if (!term) return;
		term.write('\r\n\x1b[1;32mroot@dc-node-01\x1b[0m:\x1b[1;34m~\x1b[0m# ');
	}

	/**
	 * Resolve the best matching response for a command string.
	 * Priority:
	 *  1. Exact match
	 *  2. Longest key that the input starts with (allows "smartctl -H /dev/sda" to match "smartctl -H /dev/sda" key)
	 *  3. Base command (first token) match — gives a helpful usage hint when full args not found
	 */
	function resolveResponse(trimmed: string): string | null {
		// 1. Exact match
		if (mockResponses[trimmed] !== undefined) return mockResponses[trimmed];

		// 2. Longest prefix key match
		const prefixMatch = Object.keys(mockResponses)
			.filter((k) => trimmed.startsWith(k) && k !== trimmed)
			.sort((a, b) => b.length - a.length)[0];
		if (prefixMatch) return mockResponses[prefixMatch];

		// 3. Base command hint (first token)
		const baseCmd = trimmed.split(/\s+/)[0];
		if (mockResponses[baseCmd] !== undefined) return mockResponses[baseCmd];

		return null;
	}

	function handleCommandExecution(commandStr: string) {
		if (!term) return;
		const trimmed = commandStr.trim();

		if (trimmed.length > 0) {
			commandHistory.push(trimmed);
			historyIndex = commandHistory.length;
		}

		if (trimmed === 'clear') {
			term.clear();
			printPrompt();
			return;
		}

		if (trimmed === '') {
			printPrompt();
			return;
		}

		const response = resolveResponse(trimmed);
		if (response !== null) {
			term.write(response);
		} else {
			term.write(
				`\r\n\x1b[31mbash: ${trimmed}: command not found. Type 'help' for available commands.\x1b[0m\r\n`
			);
		}

		printPrompt();
	}

	export function runExternalCommand(cmd: string) {
		if (!term) return;
		term.write(cmd);
		inputBuffer = cmd;
		handleCommandExecution(cmd);
		inputBuffer = '';
	}

	onMount(() => {
		if (!terminalElement) return;

		term = new Terminal({
			cursorBlink: true,
			fontFamily: 'Consolas, Monaco, "Courier New", monospace',
			fontSize: 13,
			theme: {
				background: '#0d1117',
				foreground: '#c9d1d9',
				cursor: '#58a6ff',
				selectionBackground: '#1f6beb'
			}
		});

		fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.open(terminalElement);

		setTimeout(() => fitAddon?.fit(), 100);

		term.writeln('\x1b[1;32m============================================================\x1b[0m');
		term.writeln('\x1b[1;36m  DC-OS INTERACTIVE TERMINAL SIMULATOR v1.0                 \x1b[0m');
		term.writeln(
			'\x1b[0;37m  Type \x1b[1;33m"help"\x1b[0;37m to view available diagnostic commands.     \x1b[0m'
		);
		term.writeln('\x1b[1;32m============================================================\x1b[0m');
		printPrompt();

		term.onData((data) => {
			if (!term) return;
			const code = data.charCodeAt(0);

			if (code === 13) {
				// Enter
				const cmdToRun = inputBuffer;
				inputBuffer = '';
				handleCommandExecution(cmdToRun);
			} else if (code === 127) {
				// Backspace
				if (inputBuffer.length > 0) {
					inputBuffer = inputBuffer.slice(0, -1);
					term.write('\b \b');
				}
			} else if (data === '\x1b[A') {
				// Arrow Up — history prev
				if (historyIndex > 0) {
					historyIndex--;
					term.write('\r\x1b[K\x1b[1;32mroot@dc-node-01\x1b[0m:\x1b[1;34m~\x1b[0m# ');
					inputBuffer = commandHistory[historyIndex];
					term.write(inputBuffer);
				}
			} else if (data === '\x1b[B') {
				// Arrow Down — history next
				if (historyIndex < commandHistory.length - 1) {
					historyIndex++;
					term.write('\r\x1b[K\x1b[1;32mroot@dc-node-01\x1b[0m:\x1b[1;34m~\x1b[0m# ');
					inputBuffer = commandHistory[historyIndex];
					term.write(inputBuffer);
				} else {
					historyIndex = commandHistory.length;
					term.write('\r\x1b[K\x1b[1;32mroot@dc-node-01\x1b[0m:\x1b[1;34m~\x1b[0m# ');
					inputBuffer = '';
				}
			} else if (data === '\x1b[C') {
				// Arrow Right — no-op (cursor not tracked in buffer mode)
			} else if (data === '\x1b[D') {
				// Arrow Left — no-op (cursor not tracked in buffer mode)
			} else if (data === '\x1b[3~') {
				// Delete key — no-op in buffer mode
			} else if (data === '\x1b[H' || data === '\x1b[F') {
				// Home / End — no-op in buffer mode
			} else if (data.startsWith('\x1b')) {
				// Swallow any other unhandled escape sequences silently
			} else if (code >= 32) {
				// Printable characters
				inputBuffer += data;
				term.write(data);
			}
		});

		const handleResize = () => fitAddon?.fit();
		window.addEventListener('resize', handleResize);

		if (initialCommand) {
			setTimeout(() => runExternalCommand(initialCommand), 200);
		}

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (term) term.dispose();
	});
</script>

<div class="card flex h-full flex-col border border-base-200 bg-base-100 font-mono shadow-xl">
	<div class="card-body flex min-h-0 flex-1 flex-col p-3">
		<div class="flex shrink-0 items-center justify-between border-b border-base-200 pb-2">
			<div class="flex items-center gap-2">
				<TerminalIcon class="h-4 w-4 text-accent" />
				<span class="text-xs font-black text-base-content uppercase">LIVE CLI SANDBOX</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="badge font-mono badge-xs font-bold badge-success">EMULATED TTY</span>
				<button
					onclick={() => runExternalCommand('clear')}
					class="btn btn-square btn-ghost btn-xs"
					aria-label="Clear Console"
				>
					<RefreshCw class="h-3 w-3 text-neutral-content/60" />
				</button>
			</div>
		</div>

		<!-- Terminal Mounting Point now fills 100% of available viewport space -->
		<div
			bind:this={terminalElement}
			class="min-h-75 w-full flex-1 overflow-hidden rounded-lg border border-neutral/50 bg-[#0d1117] p-1 shadow-inner"
		></div>

		<div class="mt-2 flex shrink-0 flex-wrap gap-1.5 border-t border-base-200 pt-2 text-[10px]">
			<span class="self-center font-bold text-neutral-content/60">Quick Macros:</span>
			<button
				onclick={() => runExternalCommand('dmidecode')}
				class="btn-[9px] btn h-6 min-h-0 border border-base-300 btn-ghost">dmidecode</button
			>
			<button
				onclick={() => runExternalCommand('lsblk')}
				class="btn-[9px] btn h-6 min-h-0 border border-base-300 btn-ghost">lsblk</button
			>
			<button
				onclick={() => runExternalCommand('ethtool -m eth0')}
				class="btn-[9px] btn h-6 min-h-0 border border-base-300 btn-ghost">ethtool SFP</button
			>
			<button
				onclick={() => runExternalCommand('nvme list')}
				class="btn-[9px] btn h-6 min-h-0 border border-base-300 btn-ghost">nvme list</button
			>
			<button
				onclick={() => runExternalCommand('ipmitool sensor list')}
				class="btn-[9px] btn h-6 min-h-0 border border-base-300 btn-ghost">ipmitool</button
			>
		</div>
	</div>
</div>
