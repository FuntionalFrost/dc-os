export const pingSteps = [
	{
		step: 1,
		title: 'Local Socket & Route Inspection',
		layer: 'Layer 3 (Network)',
		protocol: 'Kernel Socket / Routing Table',
		desc: "User executes 'ping google.com'. The ICMP binary creates a raw socket socket(AF_INET, SOCK_RAW, IPPROTO_ICMP). The OS checks local host routing rules ('ip route') to determine the outgoing interface and default gateway IP.",
		dataPacket: 'Local Source: 10.240.0.45 | Target Domain: google.com | Socket: AF_INET (RAW)'
	},
	{
		step: 2,
		title: 'DNS Resolution (Domain -> IP)',
		layer: 'Layer 7 (Application) -> Layer 4 (UDP)',
		protocol: 'DNS (UDP Port 53)',
		desc: "The OS resolver checks /etc/hosts, systemd-resolved, and DNS cache. If unmapped, a UDP packet is sent to the configured nameserver in /etc/resolv.conf. The DNS server recursively resolves 'google.com' to an IPv4 address (e.g. 142.250.190.46).",
		dataPacket: 'DNS Query: google.com (Type A) -> Answer: 142.250.190.46 | Port 53'
	},
	{
		step: 3,
		title: 'ARP Resolution (Gateway MAC Discovery)',
		layer: 'Layer 2 (Data Link)',
		protocol: 'ARP (Address Resolution Protocol)',
		desc: "Since 142.250.190.46 is outside the local /24 subnet, the host targets the Default Gateway (10.240.0.1). The kernel checks its ARP cache ('ip neighbor'). If missing, an ARP Request broadcast ('Who has 10.240.0.1?') is sent over Ethernet. The gateway responds with its MAC address.",
		dataPacket:
			'ARP Request: Broadcast (ff:ff:ff:ff:ff:ff) -> ARP Reply: Gateway MAC (e0:d5:5e:a1:b2:c3)'
	},
	{
		step: 4,
		title: 'ICMP Echo Request Frame Assembly',
		layer: 'Layer 2 -> Layer 3',
		protocol: 'ICMP (Type 8, Code 0) / IPv4',
		desc: 'The kernel constructs an ICMP Echo Request payload containing timestamp telemetry and payload bytes. An IPv4 header is attached (Protocol 1, TTL=64, Src=10.240.0.45, Dst=142.250.190.46). An Ethernet II frame encapsulates the packet with Destination MAC set to Gateway MAC.',
		dataPacket:
			'Frame: [Dst MAC: e0:d5:5e:a1:b2:c3 | Src MAC: 00:0a:95:9d:68:16] [IP: 10.240.0.45 -> 142.250.190.46] [ICMP Type 8]'
	},
	{
		step: 5,
		title: 'L3 Transit & Hop-by-Hop Routing',
		layer: 'Layer 3 (Network)',
		protocol: 'IP / BGP / OSPF',
		desc: 'The packet leaves the server NIC via SFP+ transceiver. Switches perform Layer 2 forwarding. Routers strip the Layer 2 header, decrement TTL by 1, recalculate IP checksum, re-encapsulate with next-hop destination MAC, and route packet across WAN backbones using BGP routing tables.',
		dataPacket: 'Hop 1 Gateway -> Hop 2 ISP Edge -> Hop 3 Google Edge Router (TTL: 64 -> 63 -> 58)'
	},
	{
		step: 6,
		title: 'Target Reception & Echo Reply',
		layer: 'Layer 3 -> Layer 7',
		protocol: 'ICMP (Type 0, Code 0)',
		desc: "Google's edge load balancer receives the frame, verifies checksum, strips headers, and processes ICMP Type 8. The host immediately constructs an ICMP Echo Reply (Type 0, Code 0), swapping source and destination IP/MAC addresses, and sends it back across the network.",
		dataPacket: 'ICMP Echo Reply (Type 0) Src: 142.250.190.46 -> Dst: 10.240.0.45'
	},
	{
		step: 7,
		title: 'Socket Delivery & RTT Calculation',
		layer: 'Application / Terminal',
		protocol: 'ICMP / System Clock',
		desc: "The local server NIC receives the reply frame. The kernel pushes payload to the waiting raw socket. The 'ping' CLI process computes Round-Trip Time (RTT = $T_{\text{receive}} - T_{\text{send}}$) and displays output: '64 bytes from 142.250.190.46: icmp_seq=1 ttl=116 time=14.2 ms'.",
		dataPacket: 'Result: 64 Bytes | Sequence: 1 | TTL: 116 | RTT: 14.2ms | Status: 0% Packet Loss'
	}
];
