import { friendlyNameHint, FRIENDLY_NAME_HINT, isGenericDeviceName, suggestedDeviceName } from '../src/utils/device-name';

describe('isGenericDeviceName', () => {
    it('flags the factory default and empty names', () => {
        expect(isGenericDeviceName('My New Device')).toBe(true);
        expect(isGenericDeviceName('  ')).toBe(true);
        expect(isGenericDeviceName('Phone')).toBe(false);
    });
});

describe('friendlyNameHint', () => {
    it('flags empty and over-long names with the same 1–64 rule', () => {
        expect(friendlyNameHint('')).toBe(FRIENDLY_NAME_HINT);
        expect(friendlyNameHint('   ')).toBe(FRIENDLY_NAME_HINT);
        expect(friendlyNameHint('x'.repeat(65))).toBe(FRIENDLY_NAME_HINT);
        expect(friendlyNameHint('Phone')).toBeNull();
        expect(friendlyNameHint('x'.repeat(64))).toBeNull();
    });
});

describe('suggestedDeviceName', () => {
    it('uses a desktop hostname when it looks real', () => {
        expect(suggestedDeviceName(false, 'studio-pc')).toBe('studio-pc');
    });

    it('ignores localhost and empty hosts', () => {
        expect(suggestedDeviceName(false, 'localhost')).toBe('Desktop');
        expect(suggestedDeviceName(true, 'anything')).toBe('Phone');
    });
});
