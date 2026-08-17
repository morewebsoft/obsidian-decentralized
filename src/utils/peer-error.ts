/**
 * Status-bar copy for a PeerJS failure. Avoids "server" / "network error" jargon —
 * users do not know a signaling server exists.
 */
export function peerErrorUserMessage(err: { type?: string } | null | undefined): string {
    switch (err?.type) {
        case 'network':
            return "Can't reach the sync network";
        case 'server-error':
            return 'The sync network is unavailable';
        case 'disconnected':
            return 'Lost the sync network';
        case 'unavailable-id':
            return 'This device ID is already in use';
        default:
            return "Can't connect to the sync network";
    }
}

/**
 * Whether a PeerJS error should destroy the local Peer (and every live DataConnection).
 *
 * Connecting to an offline / unknown cluster member used to surface as `network` or an
 * untyped error and take a working pair "Sync Offline" (GitHub #7).
 */
export function shouldTearDownPeer(err: { type?: string }, liveConnections: number): boolean {
    if (err.type === 'peer-unavailable') return false;
    const keepMesh = err.type === 'socket-error'
        || err.type === 'webrtc'
        || err.type === 'network'
        || err.type === 'disconnected'
        || !err.type;
    if (keepMesh && liveConnections > 0) return false;
    if (err.type === 'socket-error' || err.type === 'webrtc') return false;
    return true;
}
