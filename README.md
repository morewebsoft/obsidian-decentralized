# Obsidian Decentralized

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)
![Obsidian Decentralized Banner](https://mwassets.github.io/files/obsidian-decentralized/banner.png)

Sync your Obsidian notes across devices **without a central server**. This plugin uses peer-to-peer technologies (WebRTC via PeerJS) to transfer your files directly between your devices, offering a free, private, and local-first alternative to cloud-based sync services.

Your notes are your own. This plugin ensures they stay that way.

---

## 📋 Table of Contents

- [Core Features](#-core-features)
- [How It Works](#-how-it-works)
- [Manual Installation](#-manual-installation)
- [🚀 Getting Started: Connecting Your First Devices](#-getting-started-connecting-your-first-devices)
  - [Method A: Quick Pair (recommended)](#method-a-quick-pair-recommended)
  - [Method B: Primary sync partner (for automatic reconnection)](#method-b-primary-sync-partner-for-automatic-reconnection)
  - [Method C: Offline Mode (no internet at all)](#method-c-offline-mode-no-internet-at-all)
- [⚙️ Configuration & Advanced Features](#️-configuration--advanced-features)
  - [Selective Sync](#selective-sync)
  - [Conflict Resolution](#conflict-resolution)
  - [Syncing Attachments and Config Files](#syncing-attachments-and-config-files)
  - [Offline Mode](#offline-mode-no-signaling-server)
  - [Using a Custom Signaling Server](#using-a-custom-signaling-server)
- [Conflict Center](#-conflict-center)
- [Security and Privacy](#-security-and-privacy)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Core Features

-   **🌐 True Peer-to-Peer Sync:** Files are sent directly from one device to another. No cloud storage, no middleman.
-   **🕵️‍♂️ LAN Discovery:** On desktop, Connect devices lists other vaults on the same Wi-Fi. Tap one only after that device also has Connect devices open (it shares the pairing key).
-   **🤝 Multiple Connection Methods:** Pair with the full pairing code or its QR (device ID plus encryption key). A short device ID alone is refused. On the same Wi-Fi you can tap a nearby device. With no internet, use Offline Mode (one desktop hosts; others join with its IP and token).
-   **⚙️ Powerful Sync Engine:**
    -   Handles file/folder creation, deletion, and renaming.
    -   Efficiently syncs only the changes.
    -   Intelligently chunks large files to handle attachments and media.
-   **⚔️ Conflict Management:**
    -   Choose your preferred conflict resolution strategy: create a duplicate file (safest) or last-write-wins. There is no automatic merge of conflicting edits.
    -   A dedicated "Conflict Center" in the ribbon helps you review and resolve conflicts.
-   **🎛️ Granular Control:**
    -   Selectively include or exclude folders from sync.
    -   Optionally sync all file types (images, PDFs, etc.).
    -   Optionally sync your `.obsidian` config folder (use with caution!).
-   **🏡 Fully Self-Hostable:** For ultimate privacy, you can run your own PeerJS signaling server.
-   **📱 Cross-Platform:** Works on Desktop (Windows, macOS, Linux) and Mobile (via PeerJS). LAN Discovery is desktop-only.

## 🤔 How It Works

This plugin uses **PeerJS**, which leverages **WebRTC** technology. Think of it like this:

1.  **The Matchmaker (Signaling Server):** When you want to connect two devices, they both check in with a public "signaling server." This server is like a switchboard operator; it introduces your devices to each other and helps them establish a direct communication channel.
2.  **The Direct Line (P2P Connection):** Once the introduction is made, the signaling server steps away. Your devices then communicate **directly** with each other.
3.  **Data Transfer:** All your files, changes, and deletions are sent over this direct, encrypted channel. **Your notes are never stored on any third-party server.** See [Security and Privacy](#-security-and-privacy) for exactly what "encrypted" covers.

For LAN connections, the plugin can also use multicast UDP packets to broadcast its presence, allowing for automatic discovery without relying on an internet-based signaling server.

## 📥 Manual Installation

No Git, Node, or clone is needed. You only copy **three files** from the GitHub release.

1.  Open the [**Releases**](https://github.com/iWebbIO/obsidian-decentralized/releases) page and click the newest version.
2.  Scroll to **Assets** and download these three files one by one:
    -   **`main.js`**
    -   **`manifest.json`**
    -   **`styles.css`**

    All three are required — without `styles.css` the pairing screens render unstyled.

    Skip **Source code (zip)** and **Source code (tar.gz)**. Those are the project source, not the plugin. Do not use the green **Code** → **Download ZIP** button on the repo home page either.
3.  In your file explorer, open your vault and go to `.obsidian/plugins/`.
    -   If you don't see `.obsidian`, enable "Show hidden files."
    -   If `plugins` is missing, create it.
4.  Inside `plugins`, create a folder named `obsidian-decentralized`.
5.  Copy **only** the three files into that folder — `main.js`, `manifest.json`, and `styles.css`. When you are done, the folder must look like this and contain nothing else:

    ```
    <YourVault>/.obsidian/plugins/obsidian-decentralized/main.js
    <YourVault>/.obsidian/plugins/obsidian-decentralized/manifest.json
    <YourVault>/.obsidian/plugins/obsidian-decentralized/styles.css
    ```

    Do **not** drop the three files directly into `plugins/`. Do **not** copy the rest of the repository (`src/`, `package.json`, and so on).
6.  Restart Obsidian, or go to `Settings` → `Community Plugins` and toggle another plugin off and on.
7.  Go to `Settings` → `Community Plugins`. Turn **Restricted mode** off if it is on. "Obsidian Decentralized" should now be listed.
8.  Click the toggle to **enable** the plugin.

## 🚀 Getting Started: Connecting Your First Devices

Open the connection helper: the **Connect devices** button in settings, the **`users`** ribbon icon, or the "Connect to a device" command. Name this device at the top of that screen (Phone, Desktop) so the other side can tell you apart — new installs no longer all show up as "My New Device."

The helper has two tabs — **Quick Pair** and **Advanced**.

### Method A: Quick Pair (recommended)

Quick Pair shows **one pairing code** (device ID + encryption key) and a QR of the same code.

**On Device A (e.g. your desktop):**
1.  Open the connection helper and stay on the **Quick Pair** tab.
2.  Press **Copy pairing code**, or leave the QR on screen.

**On Device B (e.g. your phone):**
1.  Open the connection helper on the **Quick Pair** tab.
2.  Paste the code and press **Connect**, or tap **Scan their QR code**.
3.  On the same Wi-Fi, Device A also appears under **Nearby** once it has this screen open — tap it. If it says to open Connect devices on that device first, do that, then tap again.
4.  When pairing succeeds, tap **Keep us connected automatically** so the two devices reconnect on their own.

> **🔑 The code on screen is the whole secret.** Treat it like a password — anyone who has it can pair with you. Pasting only a short device ID is rejected; copy the code from the other device.

### Method B: Primary sync partner (for automatic reconnection)

The **Keep us connected automatically** button after pairing sets this. You can also do it later:

1.  Open `Settings` → `Obsidian Decentralized` and find the device under **Your devices**.
2.  Click the **star** icon ("Set as Primary Sync Partner").

### Method C: Offline Mode (no internet at all)

See [Offline Mode](#offline-mode-no-signaling-server) below.

> **💡 Pro tip:** If two vaults ever look out of step, run a **Force Full Sync** — the `refresh-cw` ribbon icon, or the "Force full sync with a device" command — and pick the device to sync with.

### Syncing three or more devices

More than two devices is supported: every device keeps the others in its **Your devices**
list, gossips that list to whoever it connects to, and retries all of them in the background.
An entry that is powered off or unreachable is simply skipped — it does not knock the other
links offline, and it does not change your status.

Two things to know when you go past two devices:

-   **Pairing is per pair of devices, not per cluster.** A key is established between the two
    devices that scanned each other's code. If your phone paired with your desktop and later
    with your laptop, the desktop and laptop still have no key with each other, so that
    particular link is unencrypted until you pair those two directly. After the third pair,
    Connect devices tells you which other devices still need a direct pairing. In
    **Your devices**, a gossiped device that is **Not encrypted** has a **Pair** button —
    Reconnect cannot create the key.
-   **With "strict security" on, every link must be paired.** A device introduced only by
    gossip is refused with a notice asking you to pair. Pair each device with each other
    device (or leave strict security off, its default).
-   **Remove from group actually removes that device.** Trash (or Forget) drops it from
    every member's list and stops auto-reconnect. It can only come back by pairing again.

## ⚙️ Configuration & Advanced Features

All options live in the plugin's settings tab (`Settings` → `Obsidian Decentralized`). The **Mode** dropdown at the top controls how much is shown: `Auto` keeps things minimal with safe defaults, `Manual` exposes the common settings, and `Advanced` adds tuning and security options.

### Selective Sync

-   **Included folders:** Only sync folders that are in this list (one path per line). If this is empty, all folders are synced by default.
-   **Excluded folders:** Never sync folders in this list. This takes priority over the included list.

### Conflict Resolution

When a file is changed on two devices before they have a chance to sync, a conflict occurs. Choose how you want to handle this:

-   **Create Conflict File (default and safest):** The incoming change is saved as a new file, e.g. `My Note (conflict on 2023-10-27).md`, so you can compare and merge them yourself.
-   **Last Write Wins:** The version with the newest modification time is kept and the other is discarded.

When exactly two devices are paired and two-device optimizations are on, the plugin instead resolves conflicts by role: the primary device's copy wins. This is automatic and overrides the setting above.

### Syncing Attachments and Config Files

-   **Sync all file types:** By default, the plugin focuses on text files. Enable this to sync images, PDFs, audio, and other attachments.
-   **Sync '.obsidian' configuration folder:** **(DANGEROUS)** Syncs your Obsidian settings, themes, and snippets. This can cause problems if your devices have different plugins, themes, or operating systems. **Always make a backup before enabling this.**

### Offline Mode (no signaling server)

<a id="offline-mode-no-signaling-server"></a>

For LAN-only environments with no internet, or where you don't want a signaling server involved at all. One device (usually a desktop) hosts and the others connect to it.

**On the host (desktop only):**
1.  Open the connection helper → **Advanced** tab → **Switch to Offline Mode**.
2.  Press **Start Hosting**. The screen shows this computer's IP address and a security token, with buttons to copy them. If you have several adapters (VPN, WSL, virtual machines), every address is listed — start with the one marked “try this first,” usually a `192.168…` Wi-Fi address. If the other device cannot reach the host, try the next address. While Offline Mode is on, Connect devices opens this screen directly (Quick Pair codes do not work here). Reopen it — or Settings → Your devices — anytime to see the same IP and token again; starting host a second time does not issue a new token.

**On each other device:**
1.  Open the connection helper → **Advanced** tab → **Switch to Offline Mode**. After that, Connect devices opens Offline Mode directly.
2.  Under **Join a Network**, enter the host's IP address and token, then connect. Hosts found on your Wi-Fi are also listed and can be selected directly.

Unlike the default mode, Offline Mode authenticates the connection: the host rejects any client presenting the wrong token.

### Using a Custom Signaling Server

For maximum privacy, you can run your own [PeerServer](https://github.com/peers/peerjs-server). In the plugin's "Advanced Settings," enable "Use custom signaling server" and enter your server's details.

## ⚔️ Conflict Center

If a conflict occurs and a `(conflict on DATE)` file is created, a new icon (`swords`) will appear in the left ribbon. This is the Conflict Center. It also finds leftover conflict copies when you reopen Obsidian, and from the **Resolve sync conflicts** command.

-   The icon shows a badge with the number of unresolved conflicts.
-   Clicking it opens a modal listing all conflicts.
-   Click `Resolve` on any conflict to open a diff view, allowing you to compare your local version with the remote version and choose which one to keep. **Decide later** (or closing the diff) returns you to the list. After one is resolved, the list reopens if others remain.

## 🛡️ Security and Privacy

-   **No cloud storage.** Your notes are never stored on a third-party server. They exist only on your devices.
-   **Transport encryption, always.** Every WebRTC connection is encrypted in transit with DTLS. This protects the data on the wire but says nothing about *who* is on the other end.
-   **Application-layer encryption, when you pair with the pairing code.** The code (or QR) exchanges a 256-bit AES-GCM key, and traffic on that link is encrypted with it on top of DTLS. Settings → Your devices shows **Encrypted** on each device that has a key. A bare device ID is no longer accepted as a pairing code.
-   **The signaling server sees metadata, not notes.** In the default mode your devices register a stable ID with a public PeerJS server so they can find each other. It never handles note content, but it does see your device ID and IP address each session. Run your own PeerServer, or use Offline Mode, to avoid it entirely.
-   **Know the limits.** By default, a device that knows your device ID can open a connection to you. The "strict security" setting under Advanced hardens this by refusing unrecognised and unencrypted peers; it is off by default because turning it on requires re-pairing existing devices. Offline Mode is token-authenticated regardless.

## ⚠️ Troubleshooting

-   **Plugin doesn't appear in Obsidian:** Check the folder structure is `<YourVault>/.obsidian/plugins/obsidian-decentralized/` and that this folder directly contains `main.js`, `manifest.json`, and `styles.css`.
-   **Connection Fails:**
    -   Ensure both devices are connected to the internet (for the default PeerJS mode).
    -   Check for firewalls or aggressive ad-blockers (like Pi-hole) that might be blocking the connection to the PeerJS signaling server or the P2P connection itself.
    -   Double-check that you pasted the full pairing code from the other device (Copy pairing code), not a short ID.
-   **Status is "Can't reach the sync network":** The plugin couldn't connect to the signaling server (this is not Offline Mode). It will automatically keep retrying with an increasing backoff delay. Check your internet connection, or switch to Offline Mode if you have no internet at all.
-   **A third device won't connect ("unable to reach the host"):** Extra IDs in the Your devices list are fine — unreachable ones are skipped without affecting the working links. If a row says **Not encrypted**, tap **Pair** (not Reconnect) and exchange the full code with *that* device. Under "strict security" an unpaired link is refused. See [Syncing three or more devices](#syncing-three-or-more-devices).
-   **Nearby devices don't appear:** Nearby discovery needs UDP multicast, which some VPNs, corporate networks, and firewalls block. Paste the pairing code or scan the QR instead. The other device must also have Connect devices open before a nearby tap will pair.

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome! Please feel free to open an issue or submit a pull request.

## 📜 License

This plugin is licensed under the **GNU General Public License v3.0**. For the full license text, please see the `LICENSE` file included in the repository.

Special thanks to [Ray Vermey](https://github.com/rayvermey) for their guidance, encouragement and feedback.
