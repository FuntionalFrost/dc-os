export const mockResponses: Record<string, string> = {
	help:
		'\r\n\x1b[1;36mRACK_COMMAND // SIMULATED BASH SHELL\x1b[0m\r\n' +
		'Available commands:\r\n' +
		'  \x1b[33m- Hardware:\x1b[0m  dmidecode, lspci, lshw\r\n' +
		'  \x1b[33m- Storage:\x1b[0m   lsblk, lsscsi, smartctl, nvme list, nvme smart-log /dev/nvme0\r\n' +
		'  \x1b[33m- Network:\x1b[0m   ethtool eth0, ethtool -m eth0, ip route\r\n' +
		'  \x1b[33m- OOB/Logs:\x1b[0m  ipmitool sensor list, dmesg, dmesg -T, clear, whoami\r\n' +
		'  \x1b[33m- System:\x1b[0m    uname -a, uptime, free -m, df -h, ps aux, date\r\n',

	whoami: '\r\nroot\r\n',

	'uname -a':
		'\r\nLinux dc-rack-04 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux\r\n',

	uptime: '\r\n 14:22:01 up 42 days,  3:17,  1 user,  load average: 0.12, 0.09, 0.07\r\n',

	'free -m':
		'\r\n              total        used        free      shared  buff/cache   available\r\nMem:         128529       14882        8234         320      105412      112882\r\nSwap:         16383           0       16383\r\n',

	'df -h':
		'\r\nFilesystem      Size  Used Avail Use% Mounted on\r\n/dev/sda2       893G   48G  800G   6% /\r\ntmpfs            63G  1.4M   63G   1% /dev/shm\r\n/dev/nvme0n1    3.5T  1.2T  2.3T  34% /mnt/nvme-pool\r\n',

	date: `\r\n${new Date().toUTCString()}\r\n`,

	'ps aux':
		'\r\nUSER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\r\nroot           1  0.0  0.0 167664  9348 ?        Ss   Aug01   0:09 /lib/systemd/systemd\r\nroot        1024  0.0  0.0  65532  4128 ?        Ss   Aug01   0:00 /usr/sbin/sshd\r\npostgres    1847  0.2  1.4 542136 189280 ?       Ss   Aug01  18:42 postgres: server process\r\nroot        9821  0.0  0.0   5880  1668 pts/0    R+   14:22   0:00 ps aux\r\n',

	dmidecode:
		'\r\n# dmidecode 3.5\r\nGetting SMBIOS data from sysfs.\r\nSMBIOS 3.3.0 present.\r\n\r\n\x1b[1;32mSystem Information\x1b[0m\r\n\tManufacturer: Dell Inc.\r\n\tProduct Name: PowerEdge R750\r\n\tSerial Number: \x1b[33m4X29M13\x1b[0m\r\n\tUUID: 4c4c4544-0058-3210-8039-b2c04f313333\r\n',

	'dmidecode -t memory':
		'\r\n# dmidecode 3.5\r\n\x1b[1;32mMemory Device\x1b[0m\r\n\tArray Handle: 0x1000\r\n\tTotal Width: 72 bits\r\n\tSize: \x1b[1;33m32 GB\x1b[0m\r\n\tForm Factor: DIMM\r\n\tType: DDR4\r\n\tSpeed: 3200 MT/s\r\n\tManufacturer: Micron Technology\r\n\tSerial Number: 28B492A1\r\n',

	lshw: '\r\n\x1b[1;32mdc-rack-04\x1b[0m\r\n    description: Rack Server\r\n    product: PowerEdge R750\r\n    vendor: Dell Inc.\r\n    serial: 4X29M13\r\n  \x1b[1;33m*-cpu:0\x1b[0m\r\n       description: CPU\r\n       product: Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz\r\n       width: 64 bits\r\n       capacity: 3600MHz\r\n  \x1b[1;33m*-memory\x1b[0m\r\n       description: System Memory\r\n       size: 128GiB\r\n  \x1b[1;33m*-network:0\x1b[0m\r\n       description: Ethernet interface\r\n       product: MT2892 Family [ConnectX-6 Dx]\r\n       vendor: Mellanox Technologies\r\n       logical name: eth0\r\n       speed: 25Gbit/s\r\n',

	'lshw -short':
		'\r\nH/W path      Device      Class       Description\r\n===========================================================\r\n                          system      PowerEdge R750\r\n/0/0                      processor   Xeon Gold 6338\r\n/0/1                      memory      128GiB System Memory\r\n/0/2          eth0        network     MT2892 [ConnectX-6 Dx]\r\n/0/3          /dev/sda    storage     PERC H745 Front RAID\r\n/0/4          /dev/nvme0  storage     Samsung NVMe PM9A1\r\n',

	lsblk:
		'\r\nNAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS\r\nsda           8:0    0 894.3G  0 disk \r\n├─sda1        8:1    0   1.1G  0 part /boot/efi\r\n└─sda2        8:2    0 893.2G  0 part / \r\nnvme0n1     259:0    0   3.5T  0 disk /mnt/nvme-pool\r\n',

	'lsblk -f':
		'\r\nNAME        FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS\r\nsda\r\n├─sda1      vfat   FAT32       B54A-109F                              1018.8M     8% /boot/efi\r\n└─sda2      ext4   1.0         a3b5d22f-1c8e-4d7a-b091-f6e23c748d19    799G     5% /\r\nnvme0n1     xfs    1           c8e2f3d1-4a56-4b78-a933-1d2e56789012      2.3T    34% /mnt/nvme-pool\r\n',

	lsscsi:
		'\r\n[0:0:0:0]    disk    PERC H745 Front  4.20  /dev/sda   /dev/sg0 \r\n[1:0:0:0]    enclosu Dell     SATA_BACKPLANE  1.00  -          /dev/sg1 \r\n',

	'smartctl -H /dev/sda':
		'\r\nsmartctl 7.3 2022-02-28 r5338 [x86_64-linux-6.8.0-40-generic]\r\n=== START OF READ SMART DATA SECTION ===\r\nSMART overall-health self-assessment test result: \x1b[1;32mPASSED\x1b[0m\r\n',

	smartctl:
		'\r\nsmartctl 7.3 2022-02-28 r5338 [x86_64-linux-6.8.0-40-generic]\r\nUsage: smartctl [options] device\r\n  \x1b[33msudo smartctl -H /dev/sda\x1b[0m   — health check\r\n  \x1b[33msudo smartctl -a /dev/sda\x1b[0m   — all attributes\r\n',

	'nvme list':
		'\r\nNode             SN                   Model                                  Namespace Usage                      Format           FW Rev  \r\n---------------- -------------------- -------------------------------------- --------- -------------------------- ---------------- --------\r\n/dev/nvme0n1     S5GUNA0R102938       SAMSUNG MZQL23T8HCLS-00A07             1           3.84  TB /   3.84  TB    512   B +  0 B   MPK7301Q\r\n',

	nvme: '\r\nnvme-cli version 2.4\r\nUsage: nvme <command> [<device>] [<args>]\r\n  \x1b[33msudo nvme list\x1b[0m                          — list NVMe controllers\r\n  \x1b[33msudo nvme smart-log /dev/nvme0\x1b[0m          — SMART telemetry\r\n  \x1b[33msudo nvme format /dev/nvme0 --lbaf=1\x1b[0m    — format (4K LBA)\r\n',

	'nvme smart-log /dev/nvme0':
		'\r\nSmart Log for NVME device:nvme0 namespace-id:ffffffff\r\ncritical_warning\t\t\t: 0\r\ntemperature\t\t\t\t: \x1b[1;32m31 °C (304 K)\x1b[0m\r\navailable_reserve\t\t\t: 100%\r\npercentage_used\t\t\t: \x1b[1;33m2%\x1b[0m\r\ndata_units_read\t\t\t: 12,492,019 [6.39 TB]\r\ndata_units_written\t\t\t: 48,102,941 [24.6 TB]\r\n',

	lspci:
		'\r\n00:00.0 Host bridge: Intel Corporation Device 09a2 (rev 06)\r\n01:00.0 Ethernet controller: \x1b[1;33mMellanox Technologies MT2892 Family [ConnectX-6 Dx]\x1b[0m\r\n02:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller PM9A1\r\n',

	'ethtool eth0':
		'\r\nSettings for eth0:\r\n\tSupported ports: [ FIBRE ]\r\n\tSpeed: \x1b[1;32m25000Mb/s\x1b[0m\r\n\tDuplex: Full\r\n\tAuto-negotiation: on\r\n\tLink detected: \x1b[1;32myes\x1b[0m\r\n',

	ethtool:
		'\r\nethtool version 6.7\r\nUsage: ethtool <interface>\r\n  \x1b[33methtool eth0\x1b[0m         — link speed & duplex\r\n  \x1b[33methtool -m eth0\x1b[0m      — SFP/QSFP DOM diagnostics\r\n  \x1b[33methtool -S eth0\x1b[0m      — NIC statistics\r\n',

	'ethtool -m eth0':
		'\r\n\tIdentifier              : 0x11 (QSFP28)\r\n\tLaser bias current      : 6.750 mA\r\n\tLaser output power      : \x1b[1;32m0.5210 mW / -2.83 dBm\x1b[0m\r\n\tModule receive power    : \x1b[1;32m0.4890 mW / -3.11 dBm\x1b[0m [OK]\r\n',

	'ipmitool sensor list':
		'\r\nCPU1 Temp        | 42.000     | degrees C  | ok    | na      | na      | na      | 88.000  | 93.000  | na      \r\nCPU2 Temp        | 44.000     | degrees C  | ok    | na      | na      | na      | 88.000  | 93.000  | na      \r\nSystem Fan1 RPM  | 8400.000   | RPM        | ok    | na      | 1000.00 | 1200.00 | na      | na      | na      \r\n',

	ipmitool:
		'\r\nipmitool version 1.8.19\r\nUsage: ipmitool [options] <command>\r\n  \x1b[33msudo ipmitool sensor list\x1b[0m  — all sensor readings\r\n  \x1b[33msudo ipmitool sel list\x1b[0m     — System Event Log (SEL)\r\n  \x1b[33msudo ipmitool lan print 1\x1b[0m  — OOB IP config\r\n',

	'ipmitool sel list':
		'\r\n   1 | 09/03/2026 | 12:01:00 UTC | Temperature | CPU1 Temp | Lower Non-Critical going low\r\n   2 | 09/03/2026 | 11:54:33 UTC | Power Supply | PS1 Status | Presence detected\r\n   3 | 09/03/2026 | 08:22:11 UTC | Fan | System Fan1 | Lower Non-Critical going low\r\n',

	dmesg:
		'\r\n[\x1b[32m    0.000000\x1b[0m] Linux version 6.8.0-40-generic\r\n[\x1b[32m    0.000001\x1b[0m] BIOS-provided physical RAM map:\r\n[\x1b[32m    0.012443\x1b[0m] e1000e: Intel(R) PRO/1000 Network Driver\r\n[\x1b[32m    0.031021\x1b[0m] nvme nvme0: pci 0000:02:00.0, 64C dual-port SSD\r\n[\x1b[32m    0.048932\x1b[0m] \x1b[1;32meth0: Link is Up - 25Gbps/Full\x1b[0m\r\n',

	'dmesg -T':
		'\r\n[Mon Aug  3 10:00:01 2026] Linux version 6.8.0-40-generic\r\n[Mon Aug  3 10:00:02 2026] e1000e: Intel(R) PRO/1000 Network Driver\r\n[Mon Aug  3 10:00:03 2026] nvme nvme0: pci 0000:02:00.0, 64C dual-port SSD\r\n[Mon Aug  3 10:00:04 2026] \x1b[1;32meth0: Link is Up - 25Gbps/Full\x1b[0m\r\n',

	'ip route':
		'\r\ndefault via 10.240.0.1 dev eth0 proto dhcp metric 100 \r\n10.240.0.0/24 dev eth0 proto kernel scope link src 10.240.0.45 \r\n',

	ip: '\r\nUsage: ip [options] object { command }\r\n  \x1b[33mip route\x1b[0m       — show routing table\r\n  \x1b[33mip addr\x1b[0m        — show interface addresses\r\n  \x1b[33mip neighbor\x1b[0m    — show ARP cache\r\n',

	'ip addr':
		'\r\n1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\r\n    link/loopback 00:00:00:00:00:00\r\n    inet 127.0.0.1/8 scope host lo\r\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000\r\n    link/ether 00:0a:95:9d:68:16 brd ff:ff:ff:ff:ff:ff\r\n    inet \x1b[1;32m10.240.0.45/24\x1b[0m brd 10.240.0.255 scope global eth0\r\n',

	'ip neighbor':
		'\r\n10.240.0.1 dev eth0 lladdr e0:d5:5e:a1:b2:c3 REACHABLE\r\n10.240.0.10 dev eth0 lladdr 00:25:90:a1:b2:c4 STALE\r\n'
};
