import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const prerender = true;

function renderOgSvg(): string {
	return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080c14"/>
      <stop offset="50%" stop-color="#0d1424"/>
      <stop offset="100%" stop-color="#05080f"/>
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#86efac"/>
      <stop offset="100%" stop-color="#4ade80"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="0.75" stroke-opacity="0.4"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Ambient Glow Effects -->
  <circle cx="150" cy="150" r="300" fill="url(#glowGrad)" filter="blur(40px)"/>
  <circle cx="1050" cy="480" r="280" fill="url(#glowGrad)" filter="blur(50px)"/>

  <!-- Server Rack Frame Outer Border -->
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="#0c121e" fill-opacity="0.85" stroke="#1e293b" stroke-width="2.5"/>
  
  <!-- Rack Mounting Rails (Left & Right) -->
  <rect x="60" y="60" width="24" height="510" rx="4" fill="#131c2e" stroke="#253549" stroke-width="1.5"/>
  <circle cx="72" cy="90" r="4" fill="#334155"/>
  <circle cx="72" cy="140" r="4" fill="#334155"/>
  <circle cx="72" cy="190" r="4" fill="#334155"/>
  <circle cx="72" cy="240" r="4" fill="#334155"/>
  <circle cx="72" cy="290" r="4" fill="#334155"/>
  <circle cx="72" cy="340" r="4" fill="#334155"/>
  <circle cx="72" cy="390" r="4" fill="#334155"/>
  <circle cx="72" cy="440" r="4" fill="#334155"/>
  <circle cx="72" cy="490" r="4" fill="#334155"/>
  <circle cx="72" cy="540" r="4" fill="#334155"/>

  <rect x="1116" y="60" width="24" height="510" rx="4" fill="#131c2e" stroke="#253549" stroke-width="1.5"/>
  <circle cx="1128" cy="90" r="4" fill="#334155"/>
  <circle cx="1128" cy="140" r="4" fill="#334155"/>
  <circle cx="1128" cy="190" r="4" fill="#334155"/>
  <circle cx="1128" cy="240" r="4" fill="#334155"/>
  <circle cx="1128" cy="290" r="4" fill="#334155"/>
  <circle cx="1128" cy="340" r="4" fill="#334155"/>
  <circle cx="1128" cy="390" r="4" fill="#334155"/>
  <circle cx="1128" cy="440" r="4" fill="#334155"/>
  <circle cx="1128" cy="490" r="4" fill="#334155"/>
  <circle cx="1128" cy="540" r="4" fill="#334155"/>

  <!-- Main Content Chassis -->
  <g transform="translate(120, 75)">
    <!-- Badge -->
    <rect x="0" y="0" width="230" height="32" rx="16" fill="#14241d" stroke="#166534" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="#4ade80"/>
    <text x="32" y="21" font-family="monospace, 'Courier New', Courier" font-size="12" font-weight="bold" fill="#86efac" letter-spacing="2">SYSTEMS ONLINE // V4.0</text>

    <!-- Host Domain Pill -->
    <rect x="740" y="0" width="180" height="32" rx="16" fill="#111c2e" stroke="#1e3a8a" stroke-width="1.5"/>
    <text x="760" y="21" font-family="monospace, 'Courier New', Courier" font-size="12" font-weight="bold" fill="#38bdf8" letter-spacing="1">dc-os.pages.dev</text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="monospace, 'Courier New', Courier" font-size="52" font-weight="900" fill="url(#primaryGrad)" letter-spacing="2">⚡ RACK_COMMAND // DC-OS</text>

    <!-- Subtitle / Tagline -->
    <text x="0" y="160" font-family="monospace, 'Courier New', Courier" font-size="21" font-weight="600" fill="#94a3b8" letter-spacing="0.5">All-in-One Data Center Diagnostic Suite &amp; Systems Reference</text>

    <!-- Feature Modules Cards / Grid -->
    <g transform="translate(0, 205)">
      <!-- Card 1: Terminal Console -->
      <rect x="0" y="0" width="280" height="110" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="28" cy="30" r="12" fill="#1e293b"/>
      <text x="22" y="35" font-family="monospace" font-size="15" fill="#38bdf8">📟</text>
      <text x="52" y="34" font-family="monospace" font-size="15" font-weight="bold" fill="#f1f5f9">KVM Terminal</text>
      <text x="20" y="68" font-family="monospace" font-size="12" fill="#64748b">xterm.js ANSI console</text>
      <text x="20" y="88" font-family="monospace" font-size="12" fill="#64748b">mock hardware outputs</text>

      <!-- Card 2: Subnet & Network -->
      <rect x="310" y="0" width="280" height="110" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="338" cy="30" r="12" fill="#1e293b"/>
      <text x="332" y="35" font-family="monospace" font-size="15" fill="#4ade80">📡</text>
      <text x="362" y="34" font-family="monospace" font-size="15" font-weight="bold" fill="#f1f5f9">Network Standards</text>
      <text x="330" y="68" font-family="monospace" font-size="12" fill="#64748b">Bitwise CIDR calculator</text>
      <text x="330" y="88" font-family="monospace" font-size="12" fill="#64748b">OSI layers &amp; DHCP DORA</text>

      <!-- Card 3: Optical Fiber -->
      <rect x="620" y="0" width="280" height="110" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="648" cy="30" r="12" fill="#1e293b"/>
      <text x="642" y="35" font-family="monospace" font-size="15" fill="#f59e0b">🧵</text>
      <text x="672" y="34" font-family="monospace" font-size="15" font-weight="bold" fill="#f1f5f9">Optical Fiber</text>
      <text x="640" y="68" font-family="monospace" font-size="12" fill="#64748b">TIA-598-C color lookup</text>
      <text x="640" y="88" font-family="monospace" font-size="12" fill="#64748b">Link loss budget engine</text>
    </g>

    <!-- Bottom Highlights -->
    <g transform="translate(0, 335)">
      <!-- Card 4: Host OS & Diags -->
      <rect x="0" y="0" width="435" height="85" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="12" fill="#1e293b"/>
      <text x="22" y="33" font-family="monospace" font-size="15" fill="#a855f7">💻</text>
      <text x="52" y="33" font-family="monospace" font-size="14" font-weight="bold" fill="#f1f5f9">Host OS &amp; Bare-Metal Diags</text>
      <text x="20" y="62" font-family="monospace" font-size="12" fill="#64748b">Linux boot stages, FHS maps &amp; CLI generator</text>

      <!-- Card 5: Exam Sim -->
      <rect x="465" y="0" width="435" height="85" rx="12" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
      <circle cx="493" cy="28" r="12" fill="#1e293b"/>
      <text x="487" y="33" font-family="monospace" font-size="15" fill="#ec4899">🧠</text>
      <text x="517" y="33" font-family="monospace" font-size="14" font-weight="bold" fill="#f1f5f9">CompTIA Exam Simulator</text>
      <text x="485" y="62" font-family="monospace" font-size="12" fill="#64748b">A+, Network+, Server+, Linux+ practice tests</text>
    </g>

    <!-- Bottom Status Line -->
    <text x="0" y="455" font-family="monospace, 'Courier New', Courier" font-size="12" fill="#475569" letter-spacing="1">ENGINEERED FOR DATA CENTER TECHNICIANS // SYSADMINS // NOC TEAMS</text>
  </g>
</svg>`;
}

export const GET: RequestHandler = async () => {
	const svgBuffer = Buffer.from(renderOgSvg());
	const pngBuffer = await sharp(svgBuffer).resize(1200, 630).png({ quality: 95 }).toBuffer();

	return new Response(pngBuffer, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
