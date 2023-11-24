import { describe, expect, it } from 'bun:test';
import { getMinTextureSlotSize, getFlexSizes } from './TextureUtils';
describe('TextureUtils', () => {
    describe('getMinTextureSlotSize', () => {
        it('should return the smallest size that is a power of 2 and is larger than the given size', () => {
            expect(getMinTextureSlotSize(1, 16)).toBe(16);
            expect(getMinTextureSlotSize(20, 16)).toBe(32);
            expect(getMinTextureSlotSize(33, 16)).toBe(64);
            expect(getMinTextureSlotSize(64, 16)).toBe(64);
        });
    });
    describe('getFlexSizes', () => {
        it('should correctly rearrange the sprites into various sprite sheets', () => {
            expect(Array.from(getFlexSizes(20, 30, 3, { min: 16, max: 2048 }))).toEqual([
                [32, 128], [64, 64], [128, 32], [256, 32],
                [512, 32], [1024, 32], [2048, 32]
            ]);
            expect(Array.from(getFlexSizes(5, 100, 5, { min: 16, max: 2048 }))).toEqual([
                [16, 1024], [32, 512], [64, 256], [128, 128], [256, 128], [512, 128],
                [1024, 128], [2048, 128]
            ]);
        });
    });
});
//# sourceMappingURL=TextureUtils.test.js.map