export interface TransceiverSpec {
	id: string;
	standard: string;
	formFactor: 'SFP+' | 'SFP28' | 'QSFP+' | 'QSFP28' | 'QSFP-DD' | 'OSFP';
	speed: string;
	media: 'MMF (OM3/OM4)' | 'SMF (OS2)';
	reach: string;
	wavelength: string;
	connector: string;
	rxRange: string;
	typicalUse: string;
}

export const transceiverSpecs: TransceiverSpec[] = [
	{
		id: '10g-sr',
		standard: '10GBASE-SR',
		formFactor: 'SFP+',
		speed: '10 Gbps',
		media: 'MMF (OM3/OM4)',
		reach: '300m (OM3) / 400m (OM4)',
		wavelength: '850 nm',
		connector: 'LC Duplex',
		rxRange: '-1.0 to -9.9 dBm',
		typicalUse: 'Top-of-Rack (ToR) server uplinks, short intra-row patch'
	},
	{
		id: '10g-lr',
		standard: '10GBASE-LR',
		formFactor: 'SFP+',
		speed: '10 Gbps',
		media: 'SMF (OS2)',
		reach: '10 km',
		wavelength: '1310 nm',
		connector: 'LC Duplex',
		rxRange: '+0.5 to -14.4 dBm',
		typicalUse: 'Inter-facility campus links, long backbone cross-connects'
	},
	{
		id: '25g-sr',
		standard: '25GBASE-SR',
		formFactor: 'SFP28',
		speed: '25 Gbps',
		media: 'MMF (OM3/OM4)',
		reach: '70m (OM3) / 100m (OM4)',
		wavelength: '850 nm',
		connector: 'LC Duplex',
		rxRange: '+2.4 to -10.3 dBm',
		typicalUse: 'Modern Gen-Z / PCIe Gen4 server NIC interconnects'
	},
	{
		id: '25g-lr',
		standard: '25GBASE-LR',
		formFactor: 'SFP28',
		speed: '25 Gbps',
		media: 'SMF (OS2)',
		reach: '10 km',
		wavelength: '1310 nm',
		connector: 'LC Duplex',
		rxRange: '+2.0 to -13.3 dBm',
		typicalUse: 'Long reach 25G ToR-to-Spine / DCI uplinks'
	},
	{
		id: '40g-sr4',
		standard: '40GBASE-SR4',
		formFactor: 'QSFP+',
		speed: '40 Gbps',
		media: 'MMF (OM3/OM4)',
		reach: '100m (OM3) / 150m (OM4)',
		wavelength: '850 nm (4x 10G)',
		connector: 'MPO-12',
		rxRange: '+2.4 to -9.5 dBm',
		typicalUse: 'Spine-Leaf fabric aggregation & 4x10G breakout trunks'
	},
	{
		id: '40g-lr4',
		standard: '40GBASE-LR4',
		formFactor: 'QSFP+',
		speed: '40 Gbps',
		media: 'SMF (OS2)',
		reach: '10 km',
		wavelength: 'CWDM (1271-1331 nm)',
		connector: 'LC Duplex',
		rxRange: '+2.3 to -13.7 dBm',
		typicalUse: 'Long reach 40G DC interconnects with multiplexed CWDM'
	},
	{
		id: '100g-sr4',
		standard: '100GBASE-SR4',
		formFactor: 'QSFP28',
		speed: '100 Gbps',
		media: 'MMF (OM3/OM4)',
		reach: '70m (OM3) / 100m (OM4)',
		wavelength: '850 nm (4x 25G)',
		connector: 'MPO-12',
		rxRange: '+2.4 to -10.3 dBm',
		typicalUse: 'Standard 100G Leaf-Spine cluster fabric'
	},
	{
		id: '100g-cwdm4',
		standard: '100G-CWDM4',
		formFactor: 'QSFP28',
		speed: '100 Gbps',
		media: 'SMF (OS2)',
		reach: '2 km',
		wavelength: 'CWDM (1271-1331 nm)',
		connector: 'LC Duplex',
		rxRange: '+2.5 to -10.0 dBm',
		typicalUse: 'Cost-effective intermediate campus & cross-hall links without MPO'
	},
	{
		id: '100g-psm4',
		standard: '100G-PSM4',
		formFactor: 'QSFP28',
		speed: '100 Gbps',
		media: 'SMF (OS2)',
		reach: '500 m',
		wavelength: '1310 nm (Parallel SMF)',
		connector: 'MPO-12 (SMF)',
		rxRange: '+2.0 to -9.4 dBm',
		typicalUse: 'Parallel single-mode intra-datacenter leaf-spine breakout'
	},
	{
		id: '400g-sr8',
		standard: '400GBASE-SR8',
		formFactor: 'QSFP-DD',
		speed: '400 Gbps',
		media: 'MMF (OM3/OM4)',
		reach: '70m (OM3) / 100m (OM4)',
		wavelength: '850 nm (8x 50G PAM4)',
		connector: 'MPO-16',
		rxRange: '+3.0 to -8.0 dBm',
		typicalUse: 'Next-gen AI/ML cluster fabrics and high-density spine switches'
	},
	{
		id: '400g-dr4',
		standard: '400GBASE-DR4',
		formFactor: 'QSFP-DD',
		speed: '400 Gbps',
		media: 'SMF (OS2)',
		reach: '500 m',
		wavelength: '1310 nm (4x 100G PAM4)',
		connector: 'MPO-12 (SMF)',
		rxRange: '+4.0 to -5.9 dBm',
		typicalUse: 'High-speed 4x100G breakout to QSFP28 leaf switches'
	}
];

export interface ServicePort {
	port: number;
	protocol: 'TCP' | 'UDP' | 'TCP/UDP';
	service: string;
	keyword: string;
	description: string;
	category: 'Management' | 'Infrastructure' | 'Storage/Fabric' | 'Routing';
}

export const servicePorts: ServicePort[] = [
	{
		port: 22,
		protocol: 'TCP',
		service: 'SSH / SCP / SFTP',
		keyword: 'ssh',
		description: 'Secure encrypted remote CLI administration and file transfer',
		category: 'Management'
	},
	{
		port: 53,
		protocol: 'TCP/UDP',
		service: 'DNS',
		keyword: 'domain',
		description: 'Domain Name System resolution (UDP queries, TCP zone transfers)',
		category: 'Infrastructure'
	},
	{
		port: 67,
		protocol: 'UDP',
		service: 'DHCP Server',
		keyword: 'bootps',
		description: 'Dynamic Host Configuration Protocol server broadcast listen port',
		category: 'Infrastructure'
	},
	{
		port: 68,
		protocol: 'UDP',
		service: 'DHCP Client',
		keyword: 'bootpc',
		description: 'DHCP client listen port for DORA offer/ack unicast packets',
		category: 'Infrastructure'
	},
	{
		port: 123,
		protocol: 'UDP',
		service: 'NTP',
		keyword: 'ntp',
		description: 'Network Time Protocol clock synchronization across cluster hosts',
		category: 'Infrastructure'
	},
	{
		port: 161,
		protocol: 'UDP',
		service: 'SNMP Poll',
		keyword: 'snmp',
		description: 'Simple Network Management Protocol queries from NOC monitoring stations',
		category: 'Management'
	},
	{
		port: 162,
		protocol: 'UDP',
		service: 'SNMP Trap',
		keyword: 'snmptrap',
		description: 'Asynchronous event traps and hardware alarms sent to monitoring NMS',
		category: 'Management'
	},
	{
		port: 179,
		protocol: 'TCP',
		service: 'BGP',
		keyword: 'bgp',
		description: 'Border Gateway Protocol peering between core/edge routers and ToR ASNs',
		category: 'Routing'
	},
	{
		port: 443,
		protocol: 'TCP',
		service: 'HTTPS / TLS',
		keyword: 'https',
		description: 'Encrypted BMC Web GUI (iLO/iDRAC) and secure REST API endpoints',
		category: 'Management'
	},
	{
		port: 514,
		protocol: 'UDP',
		service: 'Syslog',
		keyword: 'syslog',
		description: 'Centralized system event logging stream from switches and servers',
		category: 'Management'
	},
	{
		port: 623,
		protocol: 'UDP',
		service: 'IPMI / RMCP',
		keyword: 'asf-rmcp',
		description: 'Intelligent Platform Management Interface remote power and serial-over-LAN',
		category: 'Management'
	},
	{
		port: 3260,
		protocol: 'TCP',
		service: 'iSCSI Target',
		keyword: 'iscsi-target',
		description: 'Block storage protocol over IP for SAN array attachment',
		category: 'Storage/Fabric'
	},
	{
		port: 4789,
		protocol: 'UDP',
		service: 'VXLAN Overlay',
		keyword: 'vxlan',
		description: 'Virtual Extensible LAN encapsulation for L2-over-L3 data center overlays',
		category: 'Storage/Fabric'
	},
	{
		port: 4791,
		protocol: 'UDP',
		service: 'RoCE v2',
		keyword: 'roce',
		description: 'RDMA over Converged Ethernet v2 for zero-copy low latency GPU clustering',
		category: 'Storage/Fabric'
	}
];
