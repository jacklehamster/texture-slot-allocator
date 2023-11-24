export type TextureSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | number;
export type TextureIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
export interface Slot {
    readonly size: [TextureSize, TextureSize];
    readonly slotNumber: number;
    readonly x: number;
    y: number;
    readonly textureIndex: TextureIndex;
}
export declare class TextureSlot implements Slot {
    readonly size: [TextureSize, TextureSize];
    readonly slotNumber: number;
    readonly x: number;
    readonly y: number;
    readonly textureIndex: TextureIndex;
    readonly parent?: TextureSlot;
    sibbling?: TextureSlot;
    textureSizeLimits: {
        min: TextureSize;
        max: TextureSize;
    };
    constructor(size: [TextureSize, TextureSize], slotNumber: number, parent?: TextureSlot, textureSizeLimits?: {
        min: TextureSize;
        max: TextureSize;
    });
    calculateTextureIndex(size: [TextureSize, TextureSize], slotNumber: number): TextureIndex;
    calculatePosition(size: [TextureSize, TextureSize], slotNumber: number): {
        x: number;
        y: number;
        textureIndex: TextureIndex;
    };
    getTag(): string;
    static getTag(slot: Slot): string;
    static positionToTextureSlot(x: number, y: number, size: [TextureSize, TextureSize], textureIndex: TextureIndex, parent: TextureSlot): TextureSlot;
    getPosition(): {
        x: number;
        y: number;
        size: [number, number];
        textureIndex: TextureIndex;
    };
    canSplitHorizontally(): boolean;
    canSplitVertically(): boolean;
    splitHorizontally(): [TextureSlot, TextureSlot];
    splitVertically(): [TextureSlot, TextureSlot];
}
