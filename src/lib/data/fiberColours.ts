export const fiberColours = [
	'Blue',
	'Orange',
	'Green',
	'Brown',
	'Slate',
	'White',
	'Red',
	'Black',
	'Yellow',
	'Violet',
	'Rose',
	'Aqua'
] as const;

export type FiberColor = (typeof fiberColours)[number];

export const FIBER_COLOR_HEX_MAP: Record<string, string> = {
	blue: '#60a5fa',
	orange: '#fb923c',
	green: '#4ade80',
	brown: '#d97706',
	slate: '#94a3b8',
	white: '#e2e8f0',
	red: '#f87171',
	black: '#94a3b8', // legible neutral-slate in dark theme
	yellow: '#facc15',
	violet: '#a78bfa',
	rose: '#fb7185',
	aqua: '#22d3ee'
};

export function getFiberTextColor(color: string): string {
	return FIBER_COLOR_HEX_MAP[color.toLowerCase()] ?? '#e2e8f0';
}
