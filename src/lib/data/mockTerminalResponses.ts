export const mockResponses: Record<string, string> = {
	help:
		'\r\n\x1b[1;36mRACK_COMMAND // SIMULATED BASH SHELL\x1b[0m\r\n' +
		'Available commands:\r\n' +
		'  \x1b[33m- Privilege & Auth:\x1b[0m sudo, sudo -l, sudo -i, sudo su, visudo, whoami, id, w, last\r\n' +
		'  \x1b[33m- Remote & SSH:\x1b[0m     ssh sysadmin@10.240.0.45, ssh -L, ssh -R, ssh -D\r\n' +
		'  \x1b[33m- Open Ports/Net:\x1b[0m   ss -tulpn, ss -tlpn, lsof -i :22, lsof -i :80, netstat -tulpn, nc -zv\r\n' +
		'  \x1b[33m- Storage & Space:\x1b[0m  df -h, df -i, du -sh, lsblk, lsscsi, smartctl, nvme list\r\n' +
		'  \x1b[33m- Hardware:\x1b[0m         dmidecode, lspci, lshw, ethtool eth0, ethtool -m eth0\r\n' +
		'  \x1b[33m- OOB & Logs:\x1b[0m       ipmitool sensor list, ipmitool sel list, dmesg, dmesg -T, clear\r\n' +
		'  \x1b[33m- System:\x1b[0m           uname -a, uptime, free -m, ps aux, date\r\n',

	// Basic User & Privilege Commands
	whoami: '\r\nroot\r\n',

	id: '\r\nuid=0(root) gid=0(root) groups=0(root),27(sudo),110(docker)\r\n',

	'id sysadmin':
		'\r\nuid=1001(sysadmin) gid=1001(sysadmin) groups=1001(sysadmin),27(sudo),110(docker)\r\n',

	w: '\r\n 14:35:02 up 42 days,  3:20,  2 users,  load average: 0.14, 0.08, 0.05\r\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\r\nroot     pts/0    10.240.0.12      14:10    0.00s  0.11s  0.02s w\r\nsysadmin pts/1    10.240.0.88      11:42    2:53m  0.42s  0.05s -bash\r\n',

	last: '\r\nroot     pts/0        10.240.0.12      Wed Nov  4 14:10   still logged in\r\nsysadmin pts/1        10.240.0.88      Wed Nov  4 11:42   still logged in\r\nroot     pts/0        10.240.0.12      Tue Nov  3 09:15 - 18:22  (09:07)\r\nreboot   system boot  6.8.0-40-generic Mon Aug  3 10:00   still running\r\n\r\nwtmp begins Mon Aug  3 10:00:01 2026\r\n',

	groups: '\r\nroot sudo docker adm systemd-journal\r\n',

	useradd:
		'\r\nUsage: useradd [options] LOGIN\r\n  \x1b[33msudo useradd -m -s /bin/bash sysadmin\x1b[0m    — create user with home dir & bash\r\n  \x1b[33msudo usermod -aG sudo sysadmin\x1b[0m           — add to sudoers group\r\n',

	usermod:
		'\r\nUsage: usermod [options] LOGIN\r\n  \x1b[33msudo usermod -aG sudo sysadmin\x1b[0m    — append user to sudo group\r\n  \x1b[33msudo usermod -s /bin/zsh sysadmin\x1b[0m — change default login shell\r\n',

	passwd:
		'\r\npasswd: pam_sm_authenticate: Success\r\npasswd: password updated successfully for sysadmin\r\n',

	// Sudo & Privilege Escalation
	sudo: '\r\nusage: sudo -h | -K | -k | -V\r\nusage: sudo -v [-AknS] [-g group] [-p prompt] [-u user]\r\nusage: sudo -l [-AknS] [-g group] [-p prompt] [-U user] [-u user] [command ...]\r\nusage: sudo [-AbEHknPS] [-C num] [-D directory] [-g group] [-p prompt] [-u user] [VAR=value] command\r\n\r\nKey variations:\r\n  \x1b[33msudo -l\x1b[0m         — list allowed commands and privileges\r\n  \x1b[33msudo -i\x1b[0m         — login as root with sanitized environment\r\n  \x1b[33msudo su -\x1b[0m       — switch user to root with root profile\r\n  \x1b[33msudo visudo\x1b[0m     — safe /etc/sudoers file editor with syntax validation\r\n',

	'sudo -l':
		'\r\nMatching Defaults entries for root on dc-rack-04:\r\n    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin, use_pty\r\n\r\nUser root may run the following commands on dc-rack-04:\r\n    (ALL : ALL) ALL\r\n    (ALL) NOPASSWD: /usr/bin/systemctl restart nginx, /usr/bin/ipmitool *\r\n',

	'sudo su':
		'\r\n\x1b[1;33m[NOTICE]\x1b[0m Switching to root shell via su (inherits caller env):\r\n\x1b[1;32mroot@dc-rack-04\x1b[0m:\x1b[1;34m/home/sysadmin\x1b[0m# whoami\r\nroot\r\n\x1b[36mTip: Use "sudo -i" instead of "sudo su" to ensure environment variables are safely reset.\x1b[0m\r\n',

	'sudo su -':
		'\r\n\x1b[1;32mroot@dc-rack-04\x1b[0m:\x1b[1;34m/root\x1b[0m# whoami\r\nroot\r\n\x1b[32mEnvironment initialized: HOME=/root USER=root SHELL=/bin/bash LOGNAME=root\x1b[0m\r\n',

	'sudo -i':
		'\r\n\x1b[1;32mroot@dc-rack-04\x1b[0m:\x1b[1;34m~#\x1b[0m whoami\r\nroot\r\n\x1b[1;34m[LOGIN SHELL INITIALIZED]\x1b[0m Sourced /root/.profile & /root/.bashrc. Working directory: /root\r\n',

	su: '\r\nPassword: \r\nsu: Authentication failure (Direct "su" is restricted. Use "sudo -i" or "sudo su -")\r\n',

	'su -':
		'\r\nPassword: \r\nsu: Authentication failure (Direct root password login disabled in /etc/shadow. Use "sudo -i")\r\n',

	visudo:
		'\r\n/etc/sudoers: parsed OK\r\n(Editing requires interactive TTY editor. Use: "sudo visudo" to safely edit /etc/sudoers)\r\n',

	// Storage & Filesystem Diagnostics
	'df -h':
		'\r\nFilesystem      Size  Used Avail Use% Mounted on\r\nudev             63G     0   63G   0% /dev\r\ntmpfs            13G  1.4M   13G   1% /run\r\n/dev/sda2       893G   48G  800G   6% /\r\ntmpfs            63G     0   63G   0% /dev/shm\r\ntmpfs           5.0M     0  5.0M   0% /run/lock\r\n/dev/sda1       1.1G   78M  998M   8% /boot/efi\r\n/dev/nvme0n1    3.5T  1.2T  2.3T  34% /mnt/nvme-pool\r\n',

	'df -i':
		'\r\nFilesystem       Inodes  IUsed    IFree IUse% Mounted on\r\nudev           16382100    621 16381479    1% /dev\r\ntmpfs          16451680   1240 16450440    1% /run\r\n/dev/sda2      59310080 342110 58967970    1% /\r\n/dev/sda1             0      0        0     - /boot/efi\r\n/dev/nvme0n1  244191232 892110 243299122    1% /mnt/nvme-pool\r\n',

	df: '\r\nFilesystem     1K-blocks     Used Available Use% Mounted on\r\n/dev/sda2      936353792 50331648 838459392   6% /\r\n/dev/nvme0n1  3758096384 12582912 3745513472  34% /mnt/nvme-pool\r\n\r\n\x1b[33mTip: Use "df -h" for human-readable (GB/TB) or "df -i" for inode utilization.\x1b[0m\r\n',

	'du -sh':
		'\r\n1.2G\t/var/log\r\n4.8G\t/var/lib/docker\r\n820M\t/usr/local\r\n34M\t/etc\r\n18G\t/home/sysadmin\r\n',

	// SSH & Remoting Commands
	ssh: '\r\nOpenSSH_9.6p1 Ubuntu-3ubuntu13, OpenSSL 3.0.13 30 Jan 2024\r\nusage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface] [-b bind_address]\r\n           [-c cipher_spec] [-D [bind_address:]port] [-E log_file]\r\n           [-e escape_char] [-F configfile] [-I pkcs11] [-i identity_file]\r\n           [-J [user@]host[:port]] [-L address] [-l login_name] [-m mac_spec]\r\n           [-O ctl_cmd] [-o option] [-p port] [-Q query_option] [-R address]\r\n           [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]\r\n           destination [command [argument ...]]\r\n\r\nExamples:\r\n  \x1b[33mssh -i ~/.ssh/id_ed25519 -p 22 sysadmin@10.240.0.45\x1b[0m       — remote connect\r\n  \x1b[33mssh -L 8080:10.240.0.50:80 sysadmin@10.240.0.45\x1b[0m           — local port forward\r\n  \x1b[33mssh -R 9000:localhost:3000 sysadmin@10.240.0.45\x1b[0m            — reverse port forward\r\n  \x1b[33mssh -D 1080 sysadmin@10.240.0.45\x1b[0m                            — dynamic SOCKS5 proxy\r\n  \x1b[33mssh -J gateway.dc.net sysadmin@10.240.0.45\x1b[0m                  — tunnel via jump host\r\n',

	'ssh sysadmin@10.240.0.45':
		'\r\nAuthenticating with public key "id_ed25519"...\r\nWelcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-40-generic x86_64)\r\n\r\n * Documentation:  https://help.ubuntu.com\r\n * Management:     https://landscape.canonical.com\r\n * Support:        https://ubuntu.com/pro\r\n\r\nSystem information as of Wed Nov  4 14:35:10 UTC 2026\r\n  System load:  0.12               Processes:             312\r\n  Usage of /:   5.8% of 893.2GB    Users logged in:       1\r\n  Memory usage: 11%                IPv4 address for eth0: 10.240.0.45\r\n\r\nLast login: Wed Nov  4 14:10:02 2026 from 10.240.0.12\r\n\x1b[1;32msysadmin@dc-node-01\x1b[0m:\x1b[1;34m~\x1b[0m$ \r\n',

	'ssh -L':
		'\r\n\x1b[1;32m[SSH LOCAL PORT FORWARD ACTIVE]\x1b[0m\r\nForwarding: \x1b[33m127.0.0.1:8080\x1b[0m -> \x1b[36m10.240.0.45:80 (via SSH encrypted tunnel)\x1b[0m\r\nTraffic to http://localhost:8080 is now securely tunneled to the remote web service.\r\n',

	'ssh -R':
		'\r\n\x1b[1;32m[SSH REVERSE REMOTE PORT FORWARD ACTIVE]\x1b[0m\r\nForwarding: \x1b[33mremote:9000\x1b[0m -> \x1b[36mlocalhost:3000\x1b[0m\r\nUsers on remote server can now connect to your local workstation dev port via localhost:9000.\r\n',

	'ssh -D':
		'\r\n\x1b[1;32m[SSH DYNAMIC SOCKS5 PROXY ACTIVE]\x1b[0m\r\nListening on: \x1b[33m127.0.0.1:1080\x1b[0m\r\nConfigure your browser or run: curl --socks5-hostname 127.0.0.1:1080 https://internal-portal.corp\r\n',

	// Sockets & Open Ports (ss, lsof, netstat, nc)
	ss: '\r\nUsage: ss [ OPTIONS ] [ FILTER ]\r\n  \x1b[33mss -tulpn\x1b[0m     — show listening TCP (-t) & UDP (-u) sockets with PIDs (-p) and numeric ports (-n)\r\n  \x1b[33mss -tlpn\x1b[0m      — TCP listening ports only\r\n  \x1b[33mss -ta\x1b[0m        — all TCP connections (established & listening)\r\n  \x1b[33mss -s\x1b[0m         — socket summary statistics\r\n',

	'ss -tulpn':
		'\r\nNetid  State   Recv-Q Send-Q   Local Address:Port   Peer Address:Port Process                                          \r\ntcp    LISTEN  0      128            0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=1024,fd=3))                   \r\ntcp    LISTEN  0      511            0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=2150,fd=6),("nginx",pid=2151,fd=6))\r\ntcp    LISTEN  0      511            0.0.0.0:443         0.0.0.0:*     users:(("nginx",pid=2150,fd=7),("nginx",pid=2151,fd=7))\r\ntcp    LISTEN  0      244          127.0.0.1:5432        0.0.0.0:*     users:(("postgres",pid=1847,fd=7))               \r\ntcp    LISTEN  0      128          127.0.0.1:9100        0.0.0.0:*     users:(("node_exporter",pid=1120,fd=3))          \r\ntcp    LISTEN  0      128               [::]:22             [::]:*     users:(("sshd",pid=1024,fd=4))                   \r\nudp    UNCONN  0      0              0.0.0.0:68          0.0.0.0:*     users:(("systemd-network",pid=782,fd=18))        \r\nudp    UNCONN  0      0              0.0.0.0:623         0.0.0.0:*     users:(("ipmi-sensor",pid=912,fd=4))             \r\n',

	'ss -tlpn':
		'\r\nState   Recv-Q Send-Q   Local Address:Port   Peer Address:Port Process                                          \r\nLISTEN  0      128            0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=1024,fd=3))                   \r\nLISTEN  0      511            0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=2150,fd=6))                  \r\nLISTEN  0      511            0.0.0.0:443         0.0.0.0:*     users:(("nginx",pid=2150,fd=7))                  \r\nLISTEN  0      244          127.0.0.1:5432        0.0.0.0:*     users:(("postgres",pid=1847,fd=7))               \r\nLISTEN  0      128          127.0.0.1:9100        0.0.0.0:*     users:(("node_exporter",pid=1120,fd=3))          \r\n',

	'ss -s':
		'\r\nTotal: 412\r\nTCP:   28 (estab 4, closed 12, orphaned 0, timewait 2)\r\n\r\nTransport Total     IP        IPv6\r\nRAW	  1         1         0        \r\nUDP	  4         4         0        \r\nTCP	  16        14        2        \r\nINET	  21        19        2        \r\nFRAG	  0         0         0        \r\n',

	lsof: '\r\nUsage: lsof [options] [--] [names]\r\n  \x1b[33msudo lsof -i :22\x1b[0m      — show process bound to port 22\r\n  \x1b[33msudo lsof -i :80\x1b[0m      — show web server holding port 80\r\n  \x1b[33msudo lsof -i -P -n\x1b[0m    — list all open internet sockets without DNS delays\r\n  \x1b[33msudo lsof +L1\x1b[0m         — find deleted files still holding disk space\r\n',

	'lsof -i :22':
		'\r\nCOMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\r\nsshd    1024 root    3u  IPv4  24102      0t0  TCP *:22 (LISTEN)\r\nsshd    1024 root    4u  IPv6  24104      0t0  TCP *:22 (LISTEN)\r\nsshd    4820 root    4u  IPv4  58291      0t0  TCP 10.240.0.45:22->10.240.0.12:54210 (ESTABLISHED)\r\n',

	'lsof -i :80':
		'\r\nCOMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\r\nnginx   2150     root    6u  IPv4  31044      0t0  TCP *:80 (LISTEN)\r\nnginx   2151 www-data    6u  IPv4  31044      0t0  TCP *:80 (LISTEN)\r\n',

	'lsof -i':
		'\r\nCOMMAND   PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\r\nsystemd-  782 systemd-   18u  IPv4  19201      0t0  UDP *:68\r\nsshd     1024     root    3u  IPv4  24102      0t0  TCP *:22 (LISTEN)\r\nsshd     1024     root    4u  IPv6  24104      0t0  TCP *:22 (LISTEN)\r\nnode_exp 1120 sysadmin    3u  IPv4  26100      0t0  TCP 127.0.0.1:9100 (LISTEN)\r\npostgres 1847 postgres    7u  IPv4  28410      0t0  TCP 127.0.0.1:5432 (LISTEN)\r\nnginx    2150     root    6u  IPv4  31044      0t0  TCP *:80 (LISTEN)\r\nnginx    2150     root    7u  IPv4  31045      0t0  TCP *:443 (LISTEN)\r\n',

	'netstat -tulpn':
		'\r\nActive Internet connections (only servers)\r\nProto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    \r\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1024/sshd: /usr/sbi \r\ntcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      2150/nginx: master  \r\ntcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      2150/nginx: master  \r\ntcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      1847/postgres       \r\ntcp6       0      0 :::22                   :::*                    LISTEN      1024/sshd: /usr/sbi \r\nudp        0      0 0.0.0.0:68              0.0.0.0:*                           782/systemd-network \r\n\x1b[33mNote: netstat is obsolete. Use "ss -tulpn" for faster netlink socket inspection.\x1b[0m\r\n',

	netstat:
		'\r\nnetstat is deprecated on modern Linux kernels. Use the replacement tool: \x1b[1;32mss\x1b[0m\r\n  \x1b[33mss -tulpn\x1b[0m — show all listening TCP/UDP ports with processes\r\n',

	nc: '\r\nOpenBSD netcat (Debian 1.226-1ubuntu2)\r\nusage: nc [-46CDdFhklNnrStUuvZz] [-I length] [-i interval] [-M ttl]\r\n          [-m minttl] [-O length] [-P proxy_username] [-p source_port]\r\n          [-q seconds] [-s source] [-T keyword] [-V rtable] [-W recvlimit]\r\n          [-w timeout] [-X proxy_protocol] [-x proxy_address[:port]]\r\n          [destination] [port]\r\n  \x1b[33mnc -zv 10.240.0.45 22\x1b[0m    — test remote port connectivity\r\n',

	'nc -zv':
		'\r\nConnection to 10.240.0.45 22 port [tcp/ssh] \x1b[1;32msucceeded!\x1b[0m\r\nConnection to 10.240.0.45 80 port [tcp/http] \x1b[1;32msucceeded!\x1b[0m\r\nnc: connect to 10.240.0.45 port 8443 (tcp) \x1b[31mfailed: Connection refused\x1b[0m\r\n',

	// System Information & Diagnostics
	'uname -a':
		'\r\nLinux dc-rack-04 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux\r\n',

	uptime: '\r\n 14:22:01 up 42 days,  3:17,  1 user,  load average: 0.12, 0.09, 0.07\r\n',

	'free -m':
		'\r\n              total        used        free      shared  buff/cache   available\r\nMem:         128529       14882        8234         320      105412      112882\r\nSwap:         16383           0       16383\r\n',

	date: `\r\n${new Date().toUTCString()}\r\n`,

	'ps aux':
		'\r\nUSER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\r\nroot           1  0.0  0.0 167664  9348 ?        Ss   Aug01   0:09 /lib/systemd/systemd\r\nroot        1024  0.0  0.0  65532  4128 ?        Ss   Aug01   0:00 /usr/sbin/sshd\r\npostgres    1847  0.2  1.4 542136 189280 ?       Ss   Aug01  18:42 postgres: server process\r\nnginx       2150  0.0  0.1  84210  12480 ?       Ss   Aug01   0:01 nginx: master process\r\nroot        9821  0.0  0.0   5880  1668 pts/0    R+   14:22   0:00 ps aux\r\n',

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
