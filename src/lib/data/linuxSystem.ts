// Linux Boot Process Steps
export const bootStages = [
	{
		phase: '1. UEFI / BIOS POST',
		techName: 'Power-On Self-Test & SEC/PEI/DXE',
		desc: 'Firmware initializes hardware buses, tests RAM, and reads boot flags from NVRAM. In UEFI mode, EFI Executables (.efi) are loaded from the EFI System Partition (ESP /boot/efi) formatted as FAT32.',
		keyCommands: 'efibootmgr -v, dmidecode -t bios',
		targetFiles: '/boot/efi/EFI/BOOT/BOOTX64.EFI'
	},
	{
		phase: '2. GRUB2 Bootloader',
		techName: 'Grand Unified Bootloader v2',
		desc: "GRUB executes from storage, displays kernel menu choices, reads '/boot/grub/grub.cfg', and loads the selected compressed Linux kernel ('vmlinuz') and initial RAM disk ('initrd.img' or 'initramfs') directly into host memory.",
		keyCommands: 'grub-install /dev/sda, update-grub',
		targetFiles: '/boot/grub/grub.cfg, /boot/vmlinuz-*, /boot/initrd.img-*'
	},
	{
		phase: '3. Kernel & initramfs Setup',
		techName: 'Kernel Decompression & Root Mount',
		desc: "Kernel initializes CPU cores, memory channels, and virtualization extensions. It executes 'initramfs' (a temporary root file system in RAM) containing temporary RAID/NVMe drivers to find and mount the true root filesystem ('/'). It then executes the real init process (/sbin/init).",
		keyCommands: 'dmesg | head -n 30, lsinitramfs /boot/initrd.img',
		targetFiles: '/sbin/init (symbolic link to /lib/systemd/systemd)'
	},
	{
		phase: '4. systemd Init (PID 1)',
		techName: 'System Daemon Manager',
		desc: "systemd takes over PID 1, parses '/etc/systemd/system/' and '/lib/systemd/system/', mounts drives defined in '/etc/fstab', brings up network interfaces, and boots target state units ('multi-user.target' or 'graphical.target').",
		keyCommands: 'systemctl status, systemd-analyze blame, journalctl -b',
		targetFiles: '/etc/systemd/system/, /etc/fstab, /var/log/journal/'
	}
];

// Filesystem Hierarchy Standard (FHS) Directory Data
export const fhsDirectories = [
	{
		path: '/proc',
		name: 'Virtual Process Filesystem (procfs)',
		type: 'Virtual (In-Memory)',
		desc: 'Generated on-the-fly by the Linux kernel. Contains real-time operational parameters, kernel variables, and process memory maps.',
		keyFiles: '/proc/cpuinfo, /proc/meminfo, /proc/sys/net/ipv4/ip_forward, /proc/cmdline',
		interviewTip:
			"How do you enable IP routing without editing files permanently? Execute 'echo 1 > /proc/sys/net/ipv4/ip_forward'."
	},
	{
		path: '/sys',
		name: 'Sysfs Hardware & Device Tree',
		type: 'Virtual (In-Memory)',
		desc: "Exposes the kernel's device driver model. Shows physical PCIe paths, power states, NIC link speeds, and disk queue depths.",
		keyFiles: '/sys/class/net/eth0/speed, /sys/block/sda/queue/rotational, /sys/class/fc_host/',
		interviewTip:
			"How do you check if a drive is an SSD vs spinning HDD without smartctl? Read '/sys/block/sda/queue/rotational' (0 = SSD/NVMe, 1 = HDD)."
	},
	{
		path: '/etc',
		name: 'Host System Configuration',
		type: 'Physical Storage',
		desc: 'System-wide administrative configuration files and startup scripts. Contains networking parameters, user authorization tables, and daemon setups.',
		keyFiles: '/etc/fstab, /etc/resolv.conf, /etc/network/interfaces, /etc/netplan/, /etc/hosts',
		interviewTip:
			"A server fails to mount storage on boot. Which file contains corrupted partition syntax? Check '/etc/fstab'."
	},
	{
		path: '/var',
		name: 'Variable Operational Data',
		type: 'Physical Storage',
		desc: 'Holds files that grow continuously during server runtime: application logs, crash dumps, spools, and lock files.',
		keyFiles: '/var/log/syslog, /var/log/dmesg, /var/log/journal/, /var/spool/',
		interviewTip:
			"If root '/' reaches 100% disk capacity, check '/var/log/' first for runaway log accumulation."
	},
	{
		path: '/dev',
		name: 'Device Nodes & Handles',
		type: 'Virtual Device Nodes',
		desc: 'Special device files that act as driver interfaces for block devices (disks), character devices (serial consoles), and system sinks.',
		keyFiles: '/dev/sda, /dev/nvme0n1, /dev/ttyS0 (Serial Console), /dev/null, /dev/urandom',
		interviewTip:
			"How do you wipe disk headers safely? Write zeroes using 'dd if=/dev/zero of=/dev/sda bs=1M count=100'."
	}
];
