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

// Local Machine to Remote Server Workflow (SSH & Bastion & IPMI)
export interface RemotingStep {
	step: number;
	title: string;
	concept: string;
	command: string;
	explanation: string;
	tip: string;
}

export const remotingWorkflow: RemotingStep[] = [
	{
		step: 1,
		title: 'Key Generation on Local Workstation',
		concept: 'Ed25519 Elliptic Curve Key Pair',
		command: 'ssh-keygen -t ed25519 -a 100 -C "admin@workstation"',
		explanation:
			'Always generate keys on your local machine, never on the remote server. Ed25519 is preferred over RSA: it provides higher cryptographic strength (128-bit security level) with much shorter key lengths and resistance to side-channel timing attacks.',
		tip: 'Set a strong passphrase on your private key. Never distribute your private key (~/.ssh/id_ed25519).'
	},
	{
		step: 2,
		title: 'Load Key into Local SSH Agent',
		concept: 'Local Memory Key Cache',
		command: 'eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519',
		explanation:
			'The SSH Agent keeps decrypted private keys in local memory so you do not have to retype your passphrase on every connection. On macOS and Windows, use keychain or OpenSSH Authentication Agent service.',
		tip: 'Use ssh-add -l to list keys currently cached in your agent.'
	},
	{
		step: 3,
		title: 'Copy Public Key to Remote Server',
		concept: 'Authorized Keys Provisioning',
		command: 'ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 22 sysadmin@10.240.0.45',
		explanation:
			'Installs your public key into ~/.ssh/authorized_keys on the remote server and sets correct permissions (chmod 700 ~/.ssh, chmod 600 ~/.ssh/authorized_keys). If ssh-copy-id is unavailable, append the public key string manually.',
		tip: 'Strict mode in sshd requires ~/.ssh and authorized_keys to be non-writable by group or others.'
	},
	{
		step: 4,
		title: 'Configure Local ~/.ssh/config',
		concept: 'Host Aliases & Jump Hosts',
		command: `# ~/.ssh/config on local machine
Host bastion
    HostName bastion.dc.net
    User gateway
    IdentityFile ~/.ssh/id_ed25519

Host prod-db
    HostName 10.240.0.45
    User sysadmin
    ProxyJump bastion
    IdentityFile ~/.ssh/id_ed25519`,
		explanation:
			'By configuring ~/.ssh/config, you can connect with a single command: ssh prod-db. The ProxyJump directive transparently tunnels through your perimeter bastion host without requiring SSH agent forwarding to the bastion.',
		tip: 'Avoid agent forwarding (ForwardAgent yes) through shared bastions to prevent malicious hosts from hijacking your agent socket.'
	},
	{
		step: 5,
		title: 'Out-Of-Band Serial-over-LAN (SoL) Fallback',
		concept: 'IPMI / BMC Emergency Console',
		command: 'ipmitool -I lanplus -H 192.168.100.50 -U root -P Calvin123 sol activate',
		explanation:
			'When the host kernel crashes, firewall blocks SSH (port 22), or the network interface hangs, use the server BMC (Dell iDRAC, HPE iLO, Supermicro IPMI) to access the physical TTY serial console out-of-band.',
		tip: "To exit an active IPMI SoL session, enter the escape sequence: '~.' (tilde followed by period)."
	}
];

// SSH Port Forwarding Modes
export interface PortForwardingMode {
	mode: 'Local (-L)' | 'Remote (-R)' | 'Dynamic (-D)';
	direction: string;
	syntax: string;
	useCase: string;
	explanation: string;
	example: string;
}

export const portForwardingModes: PortForwardingMode[] = [
	{
		mode: 'Local (-L)',
		direction: 'Local Client -> SSH Server -> Target Server/Service',
		syntax: 'ssh -L <local_port>:<target_host>:<target_port> user@ssh_server',
		useCase:
			'Access an internal web GUI, database, or API that is only reachable from the remote server.',
		explanation:
			'Opens a listening port on your LOCAL machine. Any connection made to your local port is tunneled through the encrypted SSH connection and forwarded by the SSH server to the target host and port.',
		example:
			'ssh -N -f -L 8443:10.240.0.50:443 admin@jumphost\n# Now browse to https://localhost:8443 to view internal dashboard'
	},
	{
		mode: 'Remote (-R)',
		direction: 'Remote Server -> SSH Client -> Local Target/Service',
		syntax: 'ssh -R <remote_port>:<local_host>:<local_port> user@remote_server',
		useCase:
			'Expose a service running on your local machine to users or applications on a remote server.',
		explanation:
			'Opens a listening port on the REMOTE SSH server. Connections arriving on that remote port are tunneled back through SSH to your local machine and delivered to the specified local port.',
		example:
			'ssh -N -f -R 9000:localhost:3000 admin@remote-server\n# Users on remote-server can now reach your local dev port at localhost:9000'
	},
	{
		mode: 'Dynamic (-D)',
		direction: 'Local Apps (via SOCKS5) -> SSH Client -> SSH Server -> Internet/Intranet',
		syntax: 'ssh -D <local_port> user@ssh_server',
		useCase:
			'Route browser or curl traffic through a remote server as a secure encrypted SOCKS5 proxy.',
		explanation:
			'Allocates a local socket to act as a SOCKS5 proxy. Unlike -L which forwards to a single static destination, SOCKS5 allows your browser or client tools to dynamically tunnel any destination protocol through the SSH server.',
		example:
			'ssh -N -f -D 1080 admin@jumphost\n# Configure browser SOCKS proxy to 127.0.0.1:1080 or use curl --socks5 127.0.0.1:1080 https://internal-api'
	}
];

// Open Ports & Sockets Inspection Reference
export interface PortInspectionTool {
	command: string;
	tool: string;
	purpose: string;
	flagBreakdown: string;
	sampleOutput: string;
	interviewTip: string;
}

export const portInspectionTools: PortInspectionTool[] = [
	{
		tool: 'ss (Socket Statistics)',
		command: 'sudo ss -tulpn',
		purpose: 'Modern, high-performance socket inspection (replaces legacy netstat).',
		flagBreakdown:
			'-t (TCP) | -u (UDP) | -l (listening sockets only) | -p (show process PID and program name) | -n (numeric IP/port without DNS/service lookup)',
		sampleOutput: `Netid State   Recv-Q Send-Q   Local Address:Port   Peer Address:Port  Process
tcp   LISTEN  0      128            0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=1024,fd=3))
tcp   LISTEN  0      511            0.0.0.0:80          0.0.0.0:*      users:(("nginx",pid=2150,fd=6))
tcp   LISTEN  0      244          127.0.0.1:5432        0.0.0.0:*      users:(("postgres",pid=1847,fd=7))`,
		interviewTip:
			"Why prefer 'ss' over 'netstat'? 'ss' reads directly from kernel netlink sockets via /proc/net/sockstat, making it orders of magnitude faster on systems with tens of thousands of active connections."
	},
	{
		tool: 'lsof (List Open Files)',
		command: 'sudo lsof -i :22',
		purpose: 'Find exact process and user holding a specific TCP or UDP port.',
		flagBreakdown:
			'-i :<port> (filter by network port) | -P (prevent converting port numbers to names) | -n (prevent hostname DNS lookups)',
		sampleOutput: `COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
sshd    1024 root    3u  IPv4  24102      0t0  TCP *:22 (LISTEN)
sshd    4820 root    4u  IPv4  58291      0t0  TCP 10.240.0.45:22->10.240.0.12:54210 (ESTABLISHED)`,
		interviewTip:
			"To find what process prevents a web server from starting on port 80/443, run 'sudo lsof -i :80' to identify the rogue PID and terminate it."
	},
	{
		tool: 'nc / ncat (Netcat Remote Port Check)',
		command: 'nc -zv 10.240.0.45 22 80 443',
		purpose:
			'Verify whether a remote target port is open through firewalls without authenticating.',
		flagBreakdown:
			'-z (zero-I/O mode - scan without sending payload) | -v (verbose output) | -w 3 (timeout after 3 seconds)',
		sampleOutput: `Connection to 10.240.0.45 22 port [tcp/ssh] succeeded!
Connection to 10.240.0.45 80 port [tcp/http] succeeded!
nc: connect to 10.240.0.45 port 443 (tcp) failed: Connection refused`,
		interviewTip:
			"If a port fails with 'Connection refused', the host is reachable but no daemon is listening. If it times out, a firewall or security group dropped the SYN packet."
	}
];

// Privilege & Superuser Reference (sudo, sudo su, sudo -i)
export interface PrivilegeGuide {
	command: string;
	title: string;
	mechanism: string;
	envBehavior: string;
	bestPractice: string;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const privilegeGuides: PrivilegeGuide[] = [
	{
		command: 'sudo <command>',
		title: 'Scoped Privilege Escalation',
		mechanism:
			'Executes a single specified binary with superuser privileges via /etc/sudoers policy.',
		envBehavior:
			'Sanitizes environment variables (via env_reset in sudoers), preserves caller working directory.',
		bestPractice:
			'Industry standard. Maintains granular audit logs in /var/log/auth.log or journalctl with the exact command executed.',
		riskLevel: 'LOW'
	},
	{
		command: 'sudo -i',
		title: 'Interactive Root Login Shell',
		mechanism: 'Simulates an initial login as root, sourcing /root/.profile, /root/.bashrc.',
		envBehavior:
			'Completely resets environment. HOME becomes /root, PATH is set to root defaults, cd to /root.',
		bestPractice:
			'The safest way to enter a root shell. Guarantees no caller environment contamination or alias leakage.',
		riskLevel: 'MEDIUM'
	},
	{
		command: 'sudo su -',
		title: 'Switch User to Root via su',
		mechanism:
			'Escalates to root with sudo, then invokes the su binary to switch to root with a login shell.',
		envBehavior:
			"With the '-' switch, resets environment to root. Without the '-' switch ('sudo su'), retains the user's caller environment.",
		bestPractice:
			"Prefer 'sudo -i' over 'sudo su' because it directly uses sudo's native privilege subsystem without spawning an intermediate su child process.",
		riskLevel: 'MEDIUM'
	},
	{
		command: 'sudo -l',
		title: 'List Allowed Sudo Privileges',
		mechanism:
			'Queries /etc/sudoers and /etc/sudoers.d/* to print the commands the current user may run.',
		envBehavior: 'Read-only check, does not execute commands or modify system state.',
		bestPractice:
			"Always run 'sudo -l' first upon logging into an unfamiliar server to audit your granted roles and NOPASSWD exemptions.",
		riskLevel: 'LOW'
	},
	{
		command: 'sudo visudo',
		title: 'Edit Sudoers Safely with Syntax Check',
		mechanism:
			'Locks /etc/sudoers and parses syntax before saving. Prevents lockouts from typo errors.',
		envBehavior: 'Runs default editor ($EDITOR or nano/vim) with temporary atomic copy.',
		bestPractice:
			'NEVER edit /etc/sudoers directly with nano or vim. A syntax error will lock all administrators out of sudo access.',
		riskLevel: 'LOW'
	}
];

// Basic User & Session Commands
export interface BasicUserCommand {
	name: string;
	syntax: string;
	purpose: string;
	outputExample: string;
}

export const basicUserCommands: BasicUserCommand[] = [
	{
		name: 'whoami',
		syntax: 'whoami',
		purpose: 'Print effective username associated with current user ID.',
		outputExample: 'root'
	},
	{
		name: 'id',
		syntax: 'id [username]',
		purpose: 'Print user ID (UID), primary group (GID), and secondary group memberships.',
		outputExample:
			'uid=1001(sysadmin) gid=1001(sysadmin) groups=1001(sysadmin),27(sudo),110(docker)'
	},
	{
		name: 'w',
		syntax: 'w',
		purpose: 'Show who is logged on, their active TTY, IP source, idle time, and current process.',
		outputExample:
			'14:30:15 up 42 days, 2 users, load average: 0.14, 0.08, 0.05\nUSER     TTY   FROM          LOGIN@   IDLE   JCPU   PCPU WHAT\nsysadmin pts/0 10.240.0.12   14:10    1.00s  0.08s  0.00s w'
	},
	{
		name: 'last',
		syntax: 'last -n 5',
		purpose: 'Display history of recent user logins and reboot events parsed from /var/log/wtmp.',
		outputExample:
			'sysadmin pts/0        10.240.0.12     Wed Nov  4 14:10   still logged in\nreboot   system boot  6.8.0-40-generic Mon Aug  3 10:00   still running'
	},
	{
		name: 'useradd & usermod',
		syntax: 'sudo useradd -m -s /bin/bash <user> && sudo usermod -aG sudo <user>',
		purpose:
			'Create new user with home directory (-m), bash shell (-s), and append to sudo group (-aG).',
		outputExample: 'User created and added to supplementary group 27(sudo).'
	},
	{
		name: 'passwd',
		syntax: 'sudo passwd <username>',
		purpose: 'Update password expiration and authentication tokens in /etc/shadow.',
		outputExample: 'passwd: password updated successfully'
	}
];

// Filesystem Space & Inode Diagnostics (df -h)
export interface StorageDiagnosticTip {
	command: string;
	purpose: string;
	explanation: string;
	interviewInsight: string;
}

export const storageDiagnosticTips: StorageDiagnosticTip[] = [
	{
		command: 'df -h',
		purpose: 'Disk Free Human-Readable',
		explanation:
			'Reports file system disk space usage in powers of 1024 (K, M, G, T) for each mounted storage partition.',
		interviewInsight:
			"Use 'df -h' to identify which partition has exceeded thresholds. Root ('/') filling up stops services like logging, MySQL, and Docker."
	},
	{
		command: 'df -i',
		purpose: 'Inode Consumption Audit',
		explanation:
			'Reports the number of free and used inodes (data structures indexing file metadata) rather than disk bytes.',
		interviewInsight:
			"Classic interview trap: A disk shows 40% free space on 'df -h', but writing a file gives 'No space left on device'. Running 'df -i' will reveal 100% inode exhaustion caused by millions of tiny log or session files."
	},
	{
		command: 'du -sh /* 2>/dev/null | sort -hr | head -n 10',
		purpose: 'Top Directory Disk Sizing Drilldown',
		explanation:
			'Scans the top-level root tree and sorts the largest consumers by size, silencing permission warnings.',
		interviewInsight:
			'When root is at 99%, run this to find the offending directory (often /var/log, /var/lib/docker, or /tmp).'
	},
	{
		command: 'lsof +L1',
		purpose: 'Identify Deleted Files Still Held Open',
		explanation:
			'Finds files that have been unlinked (rm) by an administrator but still hold disk blocks because a running daemon has the file descriptor open.',
		interviewInsight:
			"You deleted a 50GB log file in /var/log/nginx/access.log, but 'df -h' didn't free any space! Why? The daemon still holds the open file handle. Run 'lsof +L1' to find the PID and restart the service to release the blocks."
	}
];
