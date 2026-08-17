import { collectLocalIpv4, preferLocalIpv4 } from '../src/utils/net';

describe('collectLocalIpv4', () => {
    it('skips loopback and link-local addresses', () => {
        const addrs = collectLocalIpv4({
            Loopback: [{ family: 'IPv4', internal: true, address: '127.0.0.1' }],
            Ethernet: [{ family: 'IPv4', internal: false, address: '169.254.10.1' }],
        });
        expect(addrs).toEqual([]);
    });

    it('prefers a Wi-Fi 192.168 address over Hyper-V / WSL adapters', () => {
        const addrs = collectLocalIpv4({
            'vEthernet (WSL)': [{ family: 'IPv4', internal: false, address: '172.29.16.1' }],
            'Wi-Fi': [{ family: 'IPv4', internal: false, address: '192.168.1.42' }],
            'VirtualBox Host-Only': [{ family: 'IPv4', internal: false, address: '192.168.56.1' }],
        });
        expect(preferLocalIpv4(addrs)).toBe('192.168.1.42');
        expect(addrs.map(a => a.address)).toEqual(['192.168.1.42', '192.168.56.1', '172.29.16.1']);
    });

    it('accepts Node 18 numeric family 4', () => {
        const addrs = collectLocalIpv4({
            eth0: [{ family: 4, internal: false, address: '10.0.0.8' }],
        });
        expect(preferLocalIpv4(addrs)).toBe('10.0.0.8');
    });

    it('dedupes the same address on two names', () => {
        const addrs = collectLocalIpv4({
            Ethernet: [{ family: 'IPv4', internal: false, address: '192.168.1.10' }],
            'Ethernet 2': [{ family: 'IPv4', internal: false, address: '192.168.1.10' }],
        });
        expect(addrs).toHaveLength(1);
    });
});
