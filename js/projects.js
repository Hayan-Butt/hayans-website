/* =========================================================
   Project data — edit this file to add or change projects.
   color: "r, g, b" used for the glowing cube
   status: "done" | "wip" | "live"
   ========================================================= */

window.PROJECTS = [
    {
        id: 'security-lab',
        name: 'Home Security Lab',
        color: '80, 150, 255',
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
        status: ['wip', 'In progress'],
        description: 'A small cyber security lab I built at home to practise spotting attacks. One virtual machine plays the attacker, another plays the victim, and a security tool called Wazuh watches everything and raises alerts.',
        points: [
            'Runs on Proxmox using low-spec hardware',
            'When I scanned the victim machine, my own custom rule caught it in real time',
            'Next up: catching password-guessing attacks and hidden admin accounts'
        ],
        info: [['Type', 'Cyber security'], ['Made with', 'Wazuh · Proxmox · Kali'], ['Machines', '3 virtual'], ['Status', 'Growing']],
        tags: ['Wazuh', 'Proxmox', 'Kali Linux', 'Ubuntu'],
        links: [
            ['View on GitHub', 'https://github.com/Hayan-Butt/wazuh-siem-homelab'],
            ['Read the write-up', 'https://github.com/Hayan-Butt/wazuh-siem-homelab/blob/main/attacks/nmap-scan.md']
        ]
    },
    {
        id: 'file-transfer',
        name: 'Encrypted File Transfer',
        color: '160, 120, 255',
        icon: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
        status: ['done', 'Complete'],
        description: 'A Windows app written in C++ that sends files from one computer to another — locked with strong encryption the whole way. Anyone snooping only sees gibberish, while the receiver gets the exact original file back.',
        points: [
            'Uses AES-256, the same kind of encryption banks rely on',
            'Live progress bar showing speed and time remaining',
            'Separate sender and receiver programs that talk over the network'
        ],
        info: [['Type', 'Desktop app'], ['Made with', 'C++ · OpenSSL'], ['Platform', 'Windows'], ['Status', 'Complete']],
        tags: ['C++', 'OpenSSL', 'Networking', 'Encryption'],
        links: [['View on GitHub', 'https://github.com/Hayan-Butt/Encrypted-File-Transfer-cpp']]
    },
    {
        id: 'chess',
        name: 'Chess Game',
        color: '90, 220, 170',
        icon: '<circle cx="12" cy="6" r="3"/><path d="M9.5 9.5 8 15h8l-1.5-5.5"/><path d="M6 19h12M7 15h10l1 4H6z"/>',
        status: ['done', 'Complete'],
        description: 'A fully playable chess game I made while learning Python over about two months. Instead of only following tutorials, I wanted to build something real — and I\'ve always loved chess.',
        points: [
            'Play a friend on the same computer, or the computer at 3 difficulty levels',
            'Drag-and-drop pieces, highlighted moves, timers and sound effects',
            'Knows check, checkmate, stalemate and pawn promotion'
        ],
        info: [['Type', 'Game'], ['Made with', 'Python · Pygame'], ['Opponent', 'Stockfish AI'], ['Status', 'Complete']],
        tags: ['Python', 'Pygame', 'Stockfish'],
        links: [['View on GitHub', 'https://github.com/Hayan-Butt/Chess-Game-using-Phyton']]
    },
    {
        id: 'arch',
        name: 'My Arch Linux Setup',
        color: '90, 190, 255',
        icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4M7 8l3 2-3 2M13 12h4"/>',
        status: ['live', 'Daily use'],
        description: 'My personal computer setup on Arch Linux with the Hyprland desktop — tuned exactly how I like it. It comes with a script that can rebuild my whole system on a fresh install, automatically.',
        points: [
            'Custom bar, launcher, terminal and notifications',
            'One script installs everything and restores all my settings',
            'Lets me reinstall from scratch without losing anything'
        ],
        info: [['Type', 'Linux setup'], ['Made with', 'Bash · Hyprland'], ['OS', 'Arch Linux'], ['Status', 'Daily use']],
        tags: ['Arch Linux', 'Hyprland', 'Bash'],
        links: [['View on GitHub', 'https://github.com/Hayan-Butt/arch-hyprland-dotfiles']]
    },
    {
        id: 'home-server',
        name: 'Home Server',
        color: '255, 170, 90',
        icon: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
        status: ['done', 'Complete'],
        description: 'I turned an old computer into a server that runs 24/7 and used it to host a Minecraft server for my friends. It was my first real hands-on project and where my interest in IT really started.',
        points: [
            'Set up Ubuntu Server from scratch',
            'Managed it remotely and opened it up to friends over the internet',
            'Learned how to keep a system running and fix it when it breaks'
        ],
        info: [['Type', 'Homelab'], ['Made with', 'Ubuntu Server'], ['Hosted', 'Minecraft'], ['Status', 'Complete']],
        tags: ['Ubuntu', 'SSH', 'Port forwarding'],
        links: []
    },
    {
        id: 'website',
        name: 'This Website',
        color: '255, 110, 170',
        icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
        status: ['live', 'Live'],
        description: 'The site you\'re looking at right now. I designed and built it by hand — no templates or frameworks — inspired by the console menus I grew up with.',
        points: [
            'Hand-written HTML, CSS and JavaScript',
            'Animated 3D background and menus you can use with the keyboard',
            'Works on phones, tablets and computers'
        ],
        info: [['Type', 'Website'], ['Made with', 'HTML · CSS · JS'], ['Hosted on', 'GitHub Pages'], ['Status', 'Live']],
        tags: ['HTML', 'CSS', 'JavaScript'],
        links: [['View on GitHub', 'https://github.com/Hayan-Butt/hayans-website']]
    }
];
