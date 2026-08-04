export interface Question {
	id: string;
	category: 'Hardware' | 'Linux' | 'Networking' | 'Fiber';
	scenario: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
}

export const compTiaQuestions: Question[] = [
	{
		id: '1',
		category: 'Fiber',
		scenario:
			'You are interpreting an OTDR (Optical Time-Domain Reflectometer) trace for a degraded 10G single-mode fiber run. The graph displays a sharp, sudden vertical drop without a reflective spike (Fresnel reflection) at the 120-meter mark. What does this signify?',
		options: [
			'A dirty bulkhead connector causing signal dispersion',
			'A tight macrobend or a high-loss mechanical fusion splice',
			'An open fiber end-face (complete fiber break)',
			'An impedance mismatch caused by water ingress in the conduit'
		],
		correctAnswer: 1,
		explanation:
			'A non-reflective event (vertical drop without a spike) on an OTDR trace indicates a point of localized attenuation without a change in the refractive index. This is characteristic of a severe fiber bend (macrobend) or a high-loss splice. A complete break or dirty connector changes the refractive index, generating a visible reflective Fresnel spike.'
	},
	{
		id: '2',
		category: 'Hardware',
		scenario:
			'A hot-swappable drive in a hardware RAID 5 array fails. During the rebuild phase onto a global hot spare, a second drive in the array encounters an Unrecoverable Read Error (URE) on a single block. What is the immediate consequence?',
		options: [
			'The RAID controller isolates the bad block and continues rebuilding',
			'The array collapses, the rebuild fails, and data must be restored from backup',
			'The hot spare dynamically switches to a RAID 0 striped array state',
			'Performance degrades by 50%, but parity calculations allow the rebuild to complete'
		],
		correctAnswer: 1,
		explanation:
			'Because RAID 5 can only tolerate a single drive failure, encountering a read error (URE) on a surviving disk during a rebuild causes a complete write failure of the parity block. Because there is no remaining redundant drive, the controller halts, the array collapses, and a restore from backup is required. This vulnerability is why data centers use RAID 6 (dual-parity) or RAID 10 for larger drives.'
	},
	{
		id: '3',
		category: 'Linux',
		scenario:
			'A database node is dropping connections. You suspect another local application is binding to the default PostgreSQL port (5432). Which command combination will instantly reveal the Process ID (PID) utilizing this port? Select the most modern and accurate command pattern.',
		options: [
			'sudo netstat -an | grep 5432',
			'sudo ss -lptun | grep :5432',
			'ps -aux | grep postgres',
			'sudo systemctl status postgresql'
		],
		correctAnswer: 1,
		explanation:
			"The 'ss' command (socket statistics) with flags '-lptun' (Listening, Processes, TCP, UDP, Numeric) displays the socket bindings alongside the process names and PIDs. The older 'netstat' is deprecated on modern Linux systems and does not display PIDs cleanly without specific flags, while 'ps' and 'systemctl' only show process state, not active socket assignments."
	},
	{
		id: '4',
		category: 'Networking',
		scenario:
			"You have configured a storage area network (SAN) switch and hypervisor interfaces for Jumbo Frames (MTU 9000). During a migration, replication transfers stall. You test the connection using: 'ping -M do -s 8972 <target_ip>'. The ping fails with 'Packet needs to be fragmented but DF set'. What does this tell you?",
		options: [
			"The source hypervisor's network card does not support offloading",
			'At least one transit switch in the network path is still configured for a standard 1500-byte MTU',
			'The ping payload exceeds 9000 bytes once ICMP headers are attached',
			'The target IP is refusing ICMP echo requests for security compliance'
		],
		correctAnswer: 1,
		explanation:
			"An MTU of 9000 allows a max ICMP payload of 8972 bytes (9000 - 20 bytes IP header - 8 bytes ICMP header). Passing the '-M do' (Don't Fragment) flag forces transit switches to drop the packet if they cannot handle the payload size. The failure confirms a misconfigured switch along the route that is still limited to a standard MTU."
	},
	{
		id: '5',
		category: 'Hardware',
		scenario:
			'A blade server in an enclosure triggers a thermal alert. Running IPMI diagnostics shows CPU temperatures reaching 95°C under light load, while system fan speeds are pinned at 100%. What is the most likely physical failure?',
		options: [
			'The chassis power distribution unit (PDU) is under-voltage',
			'Thermal paste degradation or a loose heatsink retaining bracket',
			'An airflow blockage in the hot-aisle containment door',
			'A failing BMC sensor reporting incorrect temperature values'
		],
		correctAnswer: 1,
		explanation:
			'If the fans are running at 100% duty cycle but the CPU temperature continues to climb under light load, heat is not transferring from the CPU die to the heatsink. This points directly to a physical contact failure: dried thermal interface material (TIM), missing paste, or a loose heatsink mounting bracket. Environmental or fan failures would show lower fan RPMs or a higher overall ambient motherboard temperature.'
	},
	{
		id: '6',
		category: 'Networking',
		scenario:
			'A new server cluster is deployed behind an untrusted subnet. To prevent rogue DHCP servers from handing out invalid gateway parameters inside the rack, which switch-level feature should you enable?',
		options: [
			'DHCP Relay Agent Information Option (Option 82)',
			'DHCP Snooping with trusted/untrusted port assignments',
			'Dynamic ARP Inspection (DAI) on all uplink trunks',
			'Spanning Tree Protocol Root Guard'
		],
		correctAnswer: 1,
		explanation:
			"DHCP Snooping is a Layer 2 security feature on managed switches that filters DHCP traffic. Ports connected to the legitimate corporate DHCP server are configured as 'trusted,' while user/server ports are 'untrusted.' If an untrusted port attempts to transmit a DHCP Offer or DHCP Ack packet, the switch instantly drops the frame and shuts down the port, preventing rogue IP configurations."
	},
	{
		id: '7',
		category: 'Linux',
		scenario:
			"An administrator runs 'chmod 4755 /usr/bin/custom-tool' on a utility. What is the impact of the leading '4' in this file permission configuration?",
		options: [
			'It marks the file as read-only, preventing any subsequent administrative modifications',
			"It sets the SUID (Set User ID) bit, executing the file with the permissions of the file's owner",
			'It forces the file to execute inside a localized chroot sandbox jail',
			'It sets the Sticky Bit, allowing only the file owner to delete the binary'
		],
		correctAnswer: 1,
		explanation:
			"The leading '4' in an octal file permission sets the SUID (Set Owner User ID upon execution) bit. When a standard user executes this binary, the process runs with the security context and privileges of the file's owner (typically root). This is useful for tools that need temporary root access (like 'passwd'), but presents a significant security risk if misconfigured."
	},
	{
		id: '8',
		category: 'Fiber',
		scenario:
			'You are planning a multi-node transceiver configuration inside a data center cage. Which wavelength and fiber class should you match for a 100G-SR4 QSFP28 transceiver deployment?',
		options: [
			'1310nm over Single-Mode Fiber (SMF) using LC connectors',
			'850nm over Multi-Mode Fiber (MMF) OM3/OM4 using MPO-12 connectors',
			'1550nm over Single-Mode Fiber (SMF) using SC/APC connectors',
			'1310nm over Multi-Mode Fiber (MMF) OM1 using standard ST connectors'
		],
		correctAnswer: 1,
		explanation:
			"The 'SR4' designation in transceivers stands for Short Range (up to 70m/100m) over 4 lanes of multi-mode fiber. It utilizes an 850nm VCSEL laser array. Because it sends and receives over 4 parallel channels simultaneously, it requires a multi-fiber push-on (MPO/MTP) connector, typically using an MPO-12 configuration (4 lanes Tx, 4 lanes Rx, 4 unused)."
	},
	{
		id: '9',
		category: 'Linux',
		scenario:
			"During a routine write operation, a critical file system abruptly mounts itself as 'Read-Only'. Checking 'dmesg' reveals repeated warnings: 'EXT4-fs error (device sdb1): ext4_lookup: deleted inode referenced'. What is the correct recovery procedure?",
		options: [
			"Immediately run 'rm -rf /' on the mount path to clear dead directory nodes",
			"Unmount the volume and execute 'fsck -y /dev/sdb1' to attempt file system metadata repairs",
			'Reboot the host and configure the system BIOS to run a CPU L1/L2 cache self-test',
			"Remount the drive using the 'mount -o remount,rw' bypass flag to continue operations"
		],
		correctAnswer: 1,
		explanation:
			"When a Linux system encounters structural filesystem metadata corruption, the kernel automatically remounts the filesystem as read-only ('ro') to protect data from further damage. Attempting to force-remount it writeable ('rw') will worsen the corruption. The correct procedure is to unmount the volume and run a filesystem consistency check ('fsck') to repair the metadata."
	},
	{
		id: '10',
		category: 'Hardware',
		scenario:
			"You are balancing loads on a three-phase power distribution unit (PDU) inside a server rack. The PDU displays 'Phase A: 12A, Phase B: 11A, Phase C: 2A'. Why is this configuration problematic?",
		options: [
			'The low amperage on Phase C will cause the PDU to trigger an over-voltage safety shutdown',
			'Phase imbalance can overheat the neutral conductor and shorten the lifespan of upstream transformers',
			'A phase imbalance reduces the input frequency of the line voltage from 60Hz to 50Hz',
			'Servers connected to Phase C will experience high-frequency harmonic distortion and reset'
		],
		correctAnswer: 1,
		explanation:
			'In three-phase data center power systems, loading the phases unevenly (e.g., 12A/11A/2A) leads to neutral current buildup. In severe cases, this imbalances line voltages, creates heat on the neutral line, and degrades upstream transformers. Technicians should distribute server power supplies evenly across all three phases (A, B, and C) to maintain a balanced system.'
	}
];
