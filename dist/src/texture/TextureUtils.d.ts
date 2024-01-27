import { TextureSize } from "./TextureSlot";
export declare function getMinTextureSlotSize(size: number, minSize: number): TextureSize;
export declare function getFlexSizes(w: number, h: number, count: number, textureSizeLimits: {
    min: number;
    max: number;
}): Map<number, number>;
