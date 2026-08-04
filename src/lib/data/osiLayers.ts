// Corrected OSI standard definitions & interview logic questions
export const osiLayers = [
	{
		num: 7,
		name: 'Application',
		desc: 'End-user interfaces and network-aware application processes.',
		protocols: 'HTTP, DNS, DHCP, SSH, FTP, SMTP',
		hardware: 'Layer 7 Web Application Firewalls, Application Load Balancers',
		interviewQ:
			"Q: Explain DHCP's port usage under UDP transport.\nA: DHCP utilizes UDP. Clients send packets from Source Port 68 to Destination Port 67 (Server). Servers reply from Source Port 67 to Destination Port 68 (Client)."
	},
	{
		num: 6,
		name: 'Presentation',
		desc: 'Syntax negotiation, compression, character translation, and encryption/decryption.',
		protocols: 'SSL/TLS, ASCII, MPEG, GIF',
		hardware: 'Software layers (no dedicated rack units)',
		interviewQ:
			'Q: At which layer does SSL/TLS encryption occur in pure OSI?\nA: Layer 6 (Presentation), though in the simplified TCP/IP model it merges natively with L7.'
	},
	{
		num: 5,
		name: 'Session',
		desc: 'Establishing, maintaining, synchronizing, and terminating logical links between hosts.',
		protocols: 'RPC, NetBIOS, SOCKS, PPTP',
		hardware: 'Authentication gateways, Network Security Proxies',
		interviewQ:
			'Q: What purpose does RPC fulfill?\nA: Remote Procedure Call permits localized execution parameters to target foreign hosts transparently.'
	},
	{
		num: 4,
		name: 'Transport',
		desc: 'Segment flow control, error recovery mechanisms, and protocol socket multiplexing.',
		protocols: 'TCP, UDP, SCTP',
		hardware: 'L4 Layer Firewalls, Layer 4 Load Balancers',
		interviewQ:
			'Q: Contrast TCP and UDP properties during failure conditions.\nA: TCP is stateful, connection-oriented, and handles missing segments via sequence resend loops (ARQ). UDP is stateless and fast, skipping acknowledgment to prioritize speed.'
	},
	{
		num: 3,
		name: 'Network',
		desc: 'Path discovery, logical packet routing, inter-vlan forwarding, and fragmentation.',
		protocols: 'IPv4, IPv6, ICMP, IPSec, OSPF, BGP',
		hardware: 'Enterprise Edge Routers, Layer 3 Switches',
		interviewQ:
			'Q: How does a Layer 3 Switch differ structurally from a Router?\nA: Layer 3 switches perform inter-VLAN IP packet routing in silicon hardware via ASICs at wire speed, while dedicated routers offer deeper protocol translation interfaces.'
	},
	{
		num: 2,
		name: 'Data Link',
		desc: 'Logical Link Control (LLC), Medium Access Control (MAC), and hardware collision bounds.',
		protocols: 'Ethernet (802.3), Wi-Fi (802.11), ARP, VLAN Tags (802.1Q)',
		hardware: 'Managed Layer 2 Switches, Network Interface Cards (NICs)',
		interviewQ:
			'Q: Is ARP a Layer 2 or Layer 3 protocol?\nA: It operates at Layer 2 (Data Link) to translate logical IP structures to hardware MAC addresses, bridging Layer 2 and Layer 3.'
	},
	{
		num: 1,
		name: 'Physical',
		desc: 'Hardware voltage boundaries, light wave transmission, and mechanical connector pins.',
		protocols: '10GBASE-T, TIA-598-C, 100G-SR4',
		hardware: 'SMF/MMF Fiber, SFP28/QSFP56 Transceivers, Cat6A Copper, RJ45 Keystone Modules',
		interviewQ:
			'Q: What is the maximum distance limitation for 10GBASE-T over standard Cat6 vs Cat6A copper?\nA: Cat6 supports 10G speeds up to 55 meters; Cat6A is required to run the full industry standard distance of 100 meters.'
	}
];
