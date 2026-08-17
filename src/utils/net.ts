/** One IPv4 address on a named network adapter. */
export type LocalIpv4 = { name: string; address: string };

const VIRTUAL_IFACE = /vethernet|virtualbox|vmware|hyper-?v|wsl|docker|tailscale|zerotier|hamachi|vpn|loopback|bluetooth|teredo|isatap|pseudo/i;

type Ifaces = Record<string, Array<{ family: string | number; internal: boolean; address: string }> | undefined>;

function isIpv4(family: string | number): boolean {
    return family === 'IPv4' || family === 4;
}

function isLinkLocal(address: string): boolean {
    return address.startsWith('169.254.');
}

/** Higher is more likely to be the LAN address another device on Wi-Fi can reach. */
export function scoreLocalIpv4(entry: LocalIpv4): number {
    const parts = entry.address.split('.');
    const a = parseInt(parts[0], 10);
    const b = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);
    let score = 0;
    if (a === 192 && b === 168) score += 50;
    else if (a === 10) score += 40;
    else if (a === 172 && b >= 16 && b <= 31) score += 20;
    else score += 5;

    // Host-only / ICS ranges that are almost never the shared Wi-Fi.
    if (a === 192 && b === 168 && (c === 56 || c === 137 || c === 99)) score -= 30;
    // Docker / WSL defaults sit in 172.16/12 and beat a real LAN if we only take the first NIC.
    if (a === 172 && (b === 17 || b === 18 || b === 19 || b === 23 || b === 24 || b === 29)) score -= 15;
    if (VIRTUAL_IFACE.test(entry.name)) score -= 40;
    return score;
}

/**
 * Non-internal IPv4 addresses, best LAN candidate first.
 * Node 18+ reports family as the number 4 rather than 'IPv4'.
 */
export function collectLocalIpv4(interfaces: Ifaces): LocalIpv4[] {
    const out: LocalIpv4[] = [];
    const seen = new Set<string>();
    for (const name of Object.keys(interfaces)) {
        const list = interfaces[name];
        if (!list) continue;
        for (const net of list) {
            if (!isIpv4(net.family) || net.internal || isLinkLocal(net.address)) continue;
            if (seen.has(net.address)) continue;
            seen.add(net.address);
            out.push({ name, address: net.address });
        }
    }
    return out.sort((a, b) => scoreLocalIpv4(b) - scoreLocalIpv4(a));
}

export function preferLocalIpv4(addrs: LocalIpv4[]): string | null {
    return addrs[0]?.address ?? null;
}
