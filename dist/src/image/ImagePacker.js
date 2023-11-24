import { TextureSlotAllocator } from "texture/TextureSlotAllocator";
export class ImagePacker {
    images;
    constructor(images = []) {
        this.images = images;
    }
    addImage(image, cols = 1, rows = 1) {
        this.images.push({ image, cols, rows });
    }
    clear() {
        this.images.length = 0;
    }
    async getImage(src) {
        const response = await fetch(src);
        const blob = await response.blob();
        return await createImageBitmap(blob);
    }
    async loadImage(image) {
        if (typeof (image) !== 'string') {
            return image;
        }
        return await this.getImage(image);
    }
    async pack(props = {}) {
        const canvases = [];
        const imageInfos = await Promise.all(this.images.map(async (image) => {
            const img = image.image;
            if (typeof (img) === "string") {
                throw new Error("ImagePacker: image is not loaded");
            }
            const width = img.naturalWidth ?? img.displayWidth ?? img.width?.baseValue?.value ?? img.width;
            const height = img.naturalHeight ?? img.displayHeight ?? img.height?.baseValue?.value ?? img.height;
            const cols = image.cols || 1;
            const rows = image.rows || 1;
            return {
                image: await this.loadImage(image.image),
                cols, rows,
                spriteWidth: width / cols,
                spriteHeight: height / rows,
                count: rows * cols,
            };
        }));
        const allocator = new TextureSlotAllocator(props);
        imageInfos.sort((info1, info2) => {
            const size1 = info1.cols * info1.spriteWidth + info1.rows * info1.spriteHeight;
            const size2 = info2.cols * info2.spriteWidth + info2.rows * info2.spriteHeight;
            return size2 - size1;
        });
        imageInfos.forEach(imageInfo => {
            const { image, spriteWidth, spriteHeight, count } = imageInfo;
            const slot = allocator.allocate(spriteWidth, spriteHeight, count);
            if (slot.textureIndex >= canvases.length) {
                const canvas = new OffscreenCanvas(allocator.maxTextureSize, allocator.maxTextureSize);
                canvases.push(canvas);
            }
            const canvas = canvases[slot.textureIndex];
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error("Failed to get 2d context");
            }
            ctx.imageSmoothingEnabled = true;
            const [slotWidth, slotHeight] = slot.size;
            const slotCols = Math.floor(slotWidth / spriteWidth);
            const slotRows = Math.floor(slotHeight / spriteHeight);
            for (let i = 0; i < count; i++) {
                const x = slot.x + (i % slotCols) * spriteWidth;
                const y = slot.y + Math.floor(i / slotRows) * spriteHeight;
                ctx.drawImage(image, 0, 0, spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);
            }
        });
        return canvases;
    }
}
//# sourceMappingURL=ImagePacker.js.map