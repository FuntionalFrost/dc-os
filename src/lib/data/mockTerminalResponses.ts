export const mockResponses: Record<string, string> = {
	help:
		'\r\n\x1b[1;36mRACK_COMMAND // SIMULATED BASH SHELL\x1b[0m\r\n' +
		'Available commands:\r\n' +
		'  \x1b[33m- Hardware:\x1b[0m dmidecode, lspci, lshw\r\n' +
		'  \x1b[33m- Storage:\x1b[0m  lsblk, lsscsi, smartctl -H /dev/sda, nvme list, nvme smart-log /dev/nvme0\r\n' +
		'  \x1b[33m- Network:\x1b[0m  ethtool eth0, ethtool -m eth0, ip route\r\n' +
		'  \x1b[33m- OOB/Logs:\x1b[0m ipmitool sensor list, dmesg -T, clear, whoami\r\n',

	whoami: '\r\nroot\r\n',
	'uname -a':
		'\r\nLinux dc-rack-04 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux\r\n',
	dmidecode:
		'\r\n# dmidecode 3.5\r\nGetting SMBIOS data from sysfs.\r\nSMBIOS 3.3.0 present.\r\n\r\n\x1b[1;32mSystem Information\x1b[0m\r\n\tManufacturer: Dell Inc.\r\n\tProduct Name: PowerEdge R750\r\n\tSerial Number: \x1b[33m4X29M13\x1b[0m\r\n\tUUID: 4c4c4544-0058-3210-8039-b2c04f313333\r\n',
	'dmidecode -t memory':
		'\r\n# dmidecode 3.5\r\n\x1b[1;32mMemory Device\x1b[0m\r\n\tArray Handle: 0x1000\r\n\tTotal Width: 72 bits\r\n\tSize: \x1b[1;33m32 GB\x1b[0m\r\n\tForm Factor: DIMM\r\n\tType: DDR4\r\n\tSpeed: 3200 MT/s\r\n\tManufacturer: Micron Technology\r\n\tSerial Number: 28B492A1\r\n',
	lsblk:
		'\r\nNAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS\r\nsda           8:0    0 894.3G  0 disk \r\n├─sda1        8:1    0   1.1G  0 part /boot/efi\r\n└─sda2        8:2    0 893.2G  0 part / \r\nnvme0n1     259:0    0   3.5T  0 disk /mnt/nvme-pool\r\n',
	lsscsi:
		'\r\n[0:0:0:0]    disk    PERC H745 Front  4.20  /dev/sda   /dev/sg0 \r\n[1:0:0:0]    enclosu Dell     SATA_BACKPLANE  1.00  -          /dev/sg1 \r\n',
	'smartctl -H /dev/sda':
		'\r\nsmartctl 7.3 2022-02-28 r5338 [x86_64-linux-6.8.0-40-generic]\r\n=== START OF READ SMART DATA SECTION ===\r\nSMART overall-health self-assessment test result: \x1b[1;32mPASSED\x1b[0m\r\n',
	'nvme list':
		'\r\nNode             SN                   Model                                  Namespace Usage                      Format           FW Rev  \r\n---------------- -------------------- -------------------------------------- --------- -------------------------- ---------------- --------\r\n/dev/nvme0n1     S5GUNA0R102938       SAMSUNG MZQL23T8HCLS-00A07             1           3.84  TB /   3.84  TB    512   B +  0 B   MPK7301Q\r\n',
	'nvme smart-log /dev/nvme0':
		'\r\nSmart Log for NVME device:nvme0 namespace-id:ffffffff\r\ncritical_warning			: 0\r\ntemperature				: \x1b[1;32m31 °C (304 K)\x1b[0m\r\navailable_reserve			: 100%\r\npercentage_used			: \x1b[1;33m2%\x1b[0m\r\ndata_units_read			: 12,492,019 [6.39 TB]\r\ndata_units_written			: 48,102,941 [24.6 TB]\r\n',
	lspci:
		'\r\n00:00.0 Host bridge: Intel Corporation Device 09a2 (rev 06)\r\n01:00.0 Ethernet controller: \x1b[1;33mMellanox Technologies MT2892 Family [ConnectX-6 Dx]\x1b[0m\r\n02:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM9A1\r\n',
	'ethtool eth0':
		'\r\nSettings for eth0:\r\n\tSupported ports: [ FIBRE ]\r\n\tSpeed: \x1b[1;32m25000Mb/s\x1b[0m\r\n\tDuplex: Full\r\n\tAuto-negotiation: on\r\n\tLink detected: \x1b[1;32myes\x1b[0m\r\n',
	'ethtool -m eth0':
		'\r\n\tIdentifier              : 0x11 (QSFP28)\r\n\tLaser bias current      : 6.750 mA\r\n\tLaser output power      : \x1b[1;32m0.5210 mW / -2.83 dBm\x1b[0m\r\n\tModule receive power    : \x1b[1;32m0.4890 mW / -3.11 dBm\x1b[0m [OK]\r\n',
	'ipmitool sensor list':
		'\r\nCPU1 Temp        | 42.000     | degrees C  | ok    | na      | na      | na      | 88.000  | 93.000  | na      \r\nCPU2 Temp        | 44.000     | degrees C  | ok    | na      | na      | na      | 88.000  | 93.000  | na      \r\nSystem Fan1 RPM  | 8400.000   | RPM        | ok    | na      | 1000.00 | 1200.00 | na      | na      | na      \r\n',
	'dmesg -T':
		'\r\n[Mon Aug  3 10:00:01 2026] Linux version 6.8.0-40-generic\r\n[Mon Aug  3 10:00:02 2026] e1000e: Intel(R) PRO/1000 Network Driver\r\n[Mon Aug  3 10:00:03 2026] nvme nvme0: pci 0000:02:00.0, 64C dual-port SSD\r\n[Mon Aug  3 10:00:04 2026] \x1b[1;32meth0: Link is Up - 25Gbps/Full\x1b[0m\r\n',
	'ip route':
		'\r\ndefault via 10.240.0.1 dev eth0 proto dhcp metric 100 \r\n10.240.0.0/24 dev eth0 proto kernel scope link src 10.240.0.45 \r\n'
};
