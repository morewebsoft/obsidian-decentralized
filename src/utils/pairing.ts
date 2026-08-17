import type { PeerInfo } from '../types';

/** AES-256-GCM raw key as standard base64 (32 bytes → 44 chars with padding). */
export const PSK_PATTERN = /^[A-Za-z0-9+/]{40,}={0,2}$/;

export type ParsedPairing =
    | { kind: 'full'; deviceId: string; psk: string }
    | { kind: 'device-id'; deviceId: string }
    | { kind: 'empty' }
    | { kind: 'invalid'; reason: string };

/** Collapse whitespace and the decorative hyphen the old UI inserted into device IDs. */
export function normalizeDeviceId(input: string): string {
    const cleaned = input.trim().replace(/\s+/g, '');
    if (cleaned.startsWith('device-')) {
        return `device-${cleaned.substring(7).replace(/-/g, '')}`;
    }
    const justHex = cleaned.replace(/-/g, '');
    if (justHex.length === 8 && /^[0-9a-fA-F]{8}$/.test(justHex)) {
        return `device-${justHex.toLowerCase()}`;
    }
    return cleaned;
}

export function buildPairingPayload(deviceId: string, psk: string): string {
    return `${deviceId}|${psk}`;
}

/**
 * Parse what the user typed or pasted into Quick Pair.
 *
 * A full code is `deviceId|psk` — the only form that turns encryption on.
 * A bare device ID used to silently pair without a key; callers must treat
 * that as an error on the share/paste path.
 */
export function parsePairingInput(input: string): ParsedPairing {
    const trimmed = input.trim();
    if (!trimmed) return { kind: 'empty' };

    const pipe = trimmed.indexOf('|');
    if (pipe !== -1) {
        const deviceId = normalizeDeviceId(trimmed.slice(0, pipe));
        const psk = trimmed.slice(pipe + 1).trim();
        if (!deviceId) {
            return { kind: 'invalid', reason: 'That pairing code is missing a device ID. Copy it again from the other device.' };
        }
        if (!PSK_PATTERN.test(psk)) {
            return { kind: 'invalid', reason: 'That pairing code looks damaged. Copy it again from the other device.' };
        }
        return { kind: 'full', deviceId, psk };
    }

    const deviceId = normalizeDeviceId(trimmed);
    if (deviceId.startsWith('device-') || /^[A-Za-z0-9._-]{4,}$/.test(deviceId)) {
        return { kind: 'device-id', deviceId };
    }
    return {
        kind: 'invalid',
        reason: 'That does not look like a pairing code. Paste the code you copied from the other device.',
    };
}

/** Drop the ephemeral LAN pairing key before writing a peer to disk or gossip. */
export function persistablePeerInfo(peer: PeerInfo): PeerInfo {
    const { pairingKey: _pairingKey, ...rest } = peer;
    return rest;
}
