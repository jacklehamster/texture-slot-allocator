import { Props } from "texture/TextureSlotAllocator";
/**
 * ImagePacker
 *
 * This class packs images using TextureSlotAllocator into several spritesheets.
 * For use in WebGL as textures.
 */
type ImageSource = CanvasImageSource | string;
type ImageInfo = {
    image: ImageSource;
    rows?: number;
    cols?: number;
};
export declare class ImagePacker {
    readonly images: ImageInfo[];
    constructor(images?: ImageInfo[]);
    addImage(image: CanvasImageSource, cols?: number, rows?: number): void;
    clear(): void;
    getImage(src: string): Promise<ImageBitmap>;
    loadImage(image: ImageSource): Promise<CanvasImageSource>;
    pack(props?: Props): Promise<OffscreenCanvas[]>;
}
export {};
