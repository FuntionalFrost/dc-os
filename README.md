# ⚡ RACK_COMMAND // DC-OS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with SvelteKit](https://img.shields.io/badge/SvelteKit-5-orange?logo=svelte)](https://kit.svelte.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

An all-in-one, zero-latency diagnostic suite and reference portal engineered for Data Center Technicians, Systems Administrators, and NOC Engineers operating on the server room floor. Built for maximum usability on crash cart monitors, handheld diagnostics tablets, and low-connectivity environments.

> **[🚀 Live Demo →](https://dc-os.pages.dev/)**

---

## 🚀 Key Modules & Capabilities

### 🖥️ 1. Full-Screen KVM Terminal (`/terminal`)

- **Interactive TTY Sandbox:** Full-screen `xterm.js` CLI emulator with ANSI color rendering, command history buffer, and macro quick-actions.
- **Hardware Diagnostic Mocking:** Emulates real sysadmin diagnostics including `dmidecode`, `lsblk`, `lspci`, `lshw`, `smartctl`, `nvme list`, `ethtool -m`, `ipmitool sensor list`, and `dmesg`.
- **Intelligent Command Matching:** Resolves commands by exact match → longest prefix → base command, so typing `smartctl` without full flags still returns a helpful response.
- **Zero Scroll-Wheel Hijacking:** Configured with `calc(100vh - 6.5rem)` viewport bounding so log scrolling never shifts the browser page.

### 💻 2. Host OS & Systems Suite (`/cheat-sheet`)

- **Linux Boot Stages Inspector:** Complete step-by-step guide covering UEFI/BIOS POST $\rightarrow$ GRUB2 $\rightarrow$ Kernel/initramfs $\rightarrow$ systemd PID 1 with diagnostic commands.
- **Filesystem Hierarchy Standard (FHS):** Deep-dive path analyzer for `/proc`, `/sys`, `/etc`, `/var`, and `/dev` with sysadmin interview tips.
- **Hands-On Troubleshooting Engine:** Real-world incident scenarios (e.g., CRC link flapping, rootfs kernel panics) with interactive fix evaluations.
- **Bare-Metal Diagnostics & Command Builder:** Interactive syntax generators for complex `tar`, `ip route`, and disk utility pipelines.

### 📡 3. Network Operations Center (`/networking`)

- **Bitwise IPv4 CIDR Calculator:** Real-time subnet boundary math supporting standard masks, point-to-point `/31` links (RFC 3021), and `/32` host routes.
- **"Ping google.com" Protocol Flow:** 7-stage deep packet breakdown covering Socket allocation, DNS UDP/53, ARP discovery, ICMP framing, L3 BGP transit, Echo Reply, and RTT calculation.
- **Optical Transceiver Diagnostics:** SFP+, QSFP28, and QSFP-DD form factor breakdown with real-time Digital Optical Monitoring (DOM) milliwatt-to-dBm ($10 \log_{10}(P_{\text{mW}})$) attenuation converters.
- **Interactive OSI Model & DHCP DORA Visualizer:** Layer-by-layer spec breakdown and step-by-step UDP framing simulator.

### 🧵 4. Optical Physical Layer (`/hardware`)

- **TIA-598-C Fiber Core Indexer:** Instantly converts any strand number (1–144+) into its exact buffer tube and core color pair (Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua).
- **Optical Link Loss Budget Calculator:** Computes acceptable attenuation limits in dB using the industry equation:

$$\text{Loss Limit (dB)} = (\text{Length} \times \text{Attenuation}) + (\text{Mated Pairs} \times 0.75) + (\text{Splices} \times 0.3)$$

### 🧠 5. CompTIA Exam Simulator (`/quiz`)

- **Certification Coverage:** Practice scenario bank covering CompTIA A+, Network+, Server+, and Linux+.
- **Study Mode:** Immediate answer verification with deep technical context explanations.
- **Timed Exam Mode:** 15-minute exam simulation with bookmark flagging, unanswered tracking, and automated scoring breakdown.

---

## 🛠️ Tech Stack

- **Framework:** [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) (Runes `$state`, `$derived`, `$effect`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [daisyUI v5](https://daisyui.com/) (`night`, `dracula`, `dim` themes)
- **Terminal Engine:** [xterm.js](https://xtermjs.org/) & `@xterm/addon-fit`
- **Iconography:** [Lucide Svelte](https://lucide.dev/guide/packages/lucide-svelte)
- **Build Architecture:** Static Site Generation (SSG) via `@sveltejs/adapter-static`

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

### Development

```bash
# 1. Clone the repository
git clone https://github.com/FuntionalFrost/dc-os.git
cd dc-os

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
# → http://localhost:5173
```

### Build & Preview

```bash
# Build the static site
pnpm build

# Preview the production build locally
pnpm preview
# → http://localhost:4173
```

### Other Commands

| Command       | Description                                  |
| ------------- | -------------------------------------------- |
| `pnpm check`  | Run Svelte type-checking (0 errors expected) |
| `pnpm lint`   | Run ESLint + Prettier checks                 |
| `pnpm format` | Auto-format all files with Prettier          |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on local setup, code style, and the PR workflow.

Areas where help is especially appreciated:

- 📝 More CompTIA quiz questions (A+, Network+, Server+, Linux+)
- 🖥️ More terminal mock commands and responses
- ♿ Accessibility improvements (ARIA labels, keyboard navigation)
- 🌐 Translations

---

## 📄 License

Released under the [MIT License](LICENSE). Copyright © 2026 FuntionalFrost.
