/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import AVLTree from 'avl';
import { Slot, TextureSize, TextureSlot } from './TextureSlot';
export declare const DEFAULT_MIN_TEXTURE_SIZE = 16;
export declare const DEFAULT_MAX_TEXTURE_SIZE = 4096;
export declare const DEFAULT_NUM_TEXTURE_SHEETS = 16;
export interface Props {
    numTextureSheets?: number;
    minTextureSize?: TextureSize;
    maxTextureSize?: TextureSize;
}
export declare class TextureSlotAllocator {
    textureSlots: AVLTree<TextureSlot, TextureSlot>;
    private allocatedTextures;
    private minTextureSize;
    private maxTextureSize;
    constructor({ numTextureSheets, minTextureSize, maxTextureSize }?: Props, gl?: WebGL2RenderingContext);
    allocate(w: number, h: number, count?: number): Slot;
    deallocate(slot: Slot): void;
    private allocateHelper;
    private findSlot;
    private calculateRatio;
    private bestFit;
    private isSlotUsed;
    private deallocateHelper;
    private trySplitHorizontally;
    private trySplitVertically;
    private fitSlot;
}
