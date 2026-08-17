import { peerErrorUserMessage, shouldTearDownPeer } from '../src/utils/peer-error';

describe('peerErrorUserMessage', () => {
    it('maps signaling failures to sync-network copy, not server jargon', () => {
        expect(peerErrorUserMessage({ type: 'network' })).toBe("Can't reach the sync network");
        expect(peerErrorUserMessage({ type: 'server-error' })).toBe('The sync network is unavailable');
        expect(peerErrorUserMessage({ type: 'disconnected' })).toBe('Lost the sync network');
        expect(peerErrorUserMessage({ type: 'unavailable-id' })).toBe('This device ID is already in use');
        expect(peerErrorUserMessage({})).toBe("Can't connect to the sync network");
        expect(peerErrorUserMessage(null)).toBe("Can't connect to the sync network");
    });
});

describe('shouldTearDownPeer', () => {
    it('never tears down for peer-unavailable', () => {
        expect(shouldTearDownPeer({ type: 'peer-unavailable' }, 0)).toBe(false);
        expect(shouldTearDownPeer({ type: 'peer-unavailable' }, 2)).toBe(false);
    });

    it('does not take a working group offline when one extra device is unreachable', () => {
        expect(shouldTearDownPeer({ type: 'network' }, 1)).toBe(false);
        expect(shouldTearDownPeer({ type: 'disconnected' }, 1)).toBe(false);
        expect(shouldTearDownPeer({}, 1)).toBe(false);
        expect(shouldTearDownPeer({ type: 'webrtc' }, 2)).toBe(false);
        expect(shouldTearDownPeer({ type: 'socket-error' }, 1)).toBe(false);
    });

    it('still tears down when nothing is connected and signaling is dead', () => {
        expect(shouldTearDownPeer({ type: 'network' }, 0)).toBe(true);
        expect(shouldTearDownPeer({ type: 'server-error' }, 0)).toBe(true);
        expect(shouldTearDownPeer({ type: 'unavailable-id' }, 0)).toBe(true);
    });

    it('still tears down on an ID conflict even with live links', () => {
        expect(shouldTearDownPeer({ type: 'unavailable-id' }, 2)).toBe(true);
    });
});
