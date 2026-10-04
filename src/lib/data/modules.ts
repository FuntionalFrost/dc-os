import type { Component } from 'svelte';
import { Cable, Cpu, Network, Shield, Terminal } from '@lucide/svelte';

export interface PortalModule {
	id: string;
	title: string;
	description: string;
	href: 'terminal' | 'cheat-sheet' | 'networking' | 'hardware' | 'quiz';
	buttonText: string;
	icon: Component;
	borderClass: string;
	iconBgClass: string;
	textClass: string;
	btnClass: string;
	colSpanClass?: string;
}

export const portalModules: PortalModule[] = [
	{
		id: 'terminal',
		title: 'KVM CLI TERMINAL',
		description:
			'Full-screen interactive `xterm.js` terminal simulator with ANSI colors, command history, and hardware diagnostic outputs.',
		href: 'terminal',
		buttonText: 'OPEN CONSOLE',
		icon: Terminal,
		borderClass: 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/10',
		iconBgClass: 'bg-cyan-500/20 text-cyan-400',
		textClass: 'text-cyan-400',
		btnClass:
			'btn btn-outline btn-xs border-cyan-400/50 font-mono text-cyan-400 hover:bg-cyan-400 hover:text-black'
	},
	{
		id: 'cheat-sheet',
		title: 'HOST OS & DIAGNOSTICS',
		description:
			'Linux boot stages, FHS directory maps, field troubleshooting scenarios, and interactive command generators (`tar`, `ip route`).',
		href: 'cheat-sheet',
		buttonText: 'SYSADMIN SUITE',
		icon: Cpu,
		borderClass: 'border-amber-500/30 hover:border-amber-400 hover:shadow-amber-500/10',
		iconBgClass: 'bg-amber-500/20 text-amber-400',
		textClass: 'text-amber-400',
		btnClass:
			'btn btn-outline btn-xs border-amber-400/50 font-mono text-amber-400 hover:bg-amber-400 hover:text-black'
	},
	{
		id: 'networking',
		title: 'NETWORK OPERATIONS',
		description:
			'Bitwise CIDR Subnet Calculator, step-by-step ICMP ping flow, SFP DOM power converters, and DHCP DORA handshake simulator.',
		href: 'networking',
		buttonText: 'NOC CONTROL',
		icon: Network,
		borderClass: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-emerald-500/10',
		iconBgClass: 'bg-emerald-500/20 text-emerald-400',
		textClass: 'text-emerald-400',
		btnClass:
			'btn btn-outline btn-xs border-emerald-400/50 font-mono text-emerald-400 hover:bg-emerald-400 hover:text-black'
	},
	{
		id: 'hardware',
		title: 'FIBER & L1 OPTICS',
		description:
			'Decode 144-strand fiber core bundles using TIA-598-C color coding and calculate maximum allowable optical link loss budgets.',
		href: 'hardware',
		buttonText: 'OPTICAL MATH',
		icon: Cable,
		borderClass: 'border-sky-500/30 hover:border-sky-400 hover:shadow-sky-500/10',
		iconBgClass: 'bg-sky-500/20 text-sky-400',
		textClass: 'text-sky-400',
		btnClass:
			'btn btn-outline btn-xs border-sky-400/50 font-mono text-sky-400 hover:bg-sky-400 hover:text-black'
	},
	{
		id: 'quiz',
		title: 'EXAM PREP SIMULATOR',
		description:
			'CompTIA A+, Network+, Server+, and Linux+ scenarios featuring Study Mode with explanations and a 15-minute Timed Exam Mode.',
		href: 'quiz',
		buttonText: 'START EVALUATION',
		icon: Shield,
		borderClass: 'border-rose-500/30 hover:border-rose-400 hover:shadow-rose-500/10',
		iconBgClass: 'bg-rose-500/20 text-rose-400',
		textClass: 'text-rose-400',
		btnClass:
			'btn btn-outline btn-xs border-rose-400/50 font-mono text-rose-400 hover:bg-rose-400 hover:text-black',
		colSpanClass: 'md:col-span-2 lg:col-span-1'
	}
];
