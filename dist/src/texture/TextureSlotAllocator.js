// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import AVLTree from 'avl';
import { TextureSlot } from './TextureSlot';
import { getFlexSizes } from './TextureUtils';
const DEBUG = false;
export const DEFAULT_MIN_TEXTURE_SIZE = 16;
export const DEFAULT_MAX_TEXTURE_SIZE = 4096;
export const DEFAULT_NUM_TEXTURE_SHEETS = 16;
export class TextureSlotAllocator {
    //  AVL tree of texture slots, sorted by size
    textureSlots = new AVLTree((slot1, slot2) => {
        const sizeDiff = slot1.size[0] * slot1.size[1] - slot2.size[0] * slot2.size[1];
        if (sizeDiff !== 0) {
            return sizeDiff;
        }
        return slot1.slotNumber - slot2.slotNumber;
    }, false);
    allocatedTextures = {};
    minTextureSize;
    maxTextureSize;
    numTextureSheets;
    constructor({ numTextureSheets, minTextureSize, maxTextureSize } = {}, gl) {
        this.numTextureSheets = numTextureSheets ?? DEFAULT_NUM_TEXTURE_SHEETS;
        this.minTextureSize = minTextureSize ?? DEFAULT_MIN_TEXTURE_SIZE;
        this.maxTextureSize = maxTextureSize ?? DEFAULT_MAX_TEXTURE_SIZE;
        if (gl) {
            this.numTextureSheets = Math.min(this.numTextureSheets, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS));
            this.maxTextureSize = Math.min(this.maxTextureSize, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE));
            this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
        }
        for (let i = 0; i < this.numTextureSheets; i++) {
            this.textureSlots.insert(new TextureSlot([this.maxTextureSize, this.maxTextureSize], i, undefined, {
                min: this.minTextureSize,
                max: this.maxTextureSize,
            }));
        }
    }
    allocate(w, h, count = 1) {
        const { size, slotNumber, x, y, textureIndex } = this.allocateHelper(w, h, count);
        return { size, slotNumber, x, y, textureIndex };
    }
    deallocate(slot) {
        if (!this.isSlotUsed(slot)) {
            throw new Error('Slot is not allocated');
        }
        const textureSlot = this.allocatedTextures[TextureSlot.getTag(slot)];
        this.deallocateHelper(textureSlot);
    }
    allocateHelper(w, h, count = 1) {
        const flexSizes = getFlexSizes(w, h, count, { min: this.minTextureSize, max: this.maxTextureSize });
        const slot = this.findSlot(flexSizes);
        if (!slot) {
            throw new Error(`Could not find a slot for texture to fit ${count} sprites of size ${w}x${h}`);
        }
        this.textureSlots.remove(slot);
        //  Fit the best size into the slot
        const [bestWidth, bestHeight] = this.bestFit(flexSizes, slot);
        return this.fitSlot(slot, bestWidth, bestHeight);
    }
    findSlot(flexSizes) {
        for (let i = 0; i < this.textureSlots.size; i++) {
            const slot = this.textureSlots.at(i);
            const textureSlot = slot.key;
            const [w, h] = textureSlot.size;
            if (flexSizes.get(w) <= h) {
                return textureSlot;
            }
        }
        return null;
    }
    calculateRatio(w, h) {
        return Math.max(w / h, h / w);
    }
    bestFit(flexSizes, slot) {
        const [slotWidth, slotHeight] = slot.size;
        let bestWidth = slot.textureSizeLimits.max;
        flexSizes.forEach((hSize, wSize) => {
            if (wSize <= slotWidth && hSize <= slotHeight) {
                const product = wSize * hSize;
                const bestProduct = flexSizes.get(bestWidth) * bestWidth;
                if (product < bestProduct) {
                    bestWidth = wSize;
                }
                else if (product === bestProduct) {
                    const ratio = this.calculateRatio(wSize, hSize);
                    if (ratio < this.calculateRatio(bestWidth, flexSizes.get(bestWidth))) {
                        bestWidth = wSize;
                    }
                }
            }
        });
        return [bestWidth, flexSizes.get(bestWidth)];
    }
    isSlotUsed(slot) {
        return !!this.allocatedTextures[TextureSlot.getTag(slot)];
    }
    deallocateHelper(slot) {
        //  check if we can merge with the sibbling
        if (slot.parent && slot.sibbling && !this.isSlotUsed(slot.sibbling)) {
            const sibbling = slot.sibbling;
            this.textureSlots.remove(sibbling);
            if (DEBUG && this.textureSlots.find(slot)) {
                throw new Error('Slot is not expected to be in the tree');
            }
            const parent = slot.parent;
            this.deallocateHelper(parent);
            return;
        }
        this.textureSlots.insert(slot);
        delete this.allocatedTextures[slot.getTag()];
    }
    trySplitHorizontally(slot, w, h) {
        if (slot.canSplitHorizontally()) {
            const [leftColumn, rightColumn] = slot.splitHorizontally();
            // First try to split vertically
            if (leftColumn.size[0] >= w) {
                this.textureSlots.insert(rightColumn);
                return this.fitSlot(leftColumn, w, h);
            }
        }
        return null;
    }
    trySplitVertically(slot, w, h) {
        if (slot.canSplitVertically()) {
            const [topRow, bottomRow] = slot.splitVertically();
            // Then try to split vertically
            if (topRow.size[1] >= h) {
                this.textureSlots.insert(bottomRow);
                return this.fitSlot(topRow, w, h);
            }
        }
        return null;
    }
    fitSlot(slot, w, h) {
        this.allocatedTextures[slot.getTag()] = slot;
        if (slot.size[0] > slot.size[1]) {
            const splitAttempt = this.trySplitHorizontally(slot, w, h)
                ?? this.trySplitVertically(slot, w, h);
            if (splitAttempt) {
                return splitAttempt;
            }
        }
        else {
            const splitAttempt = this.trySplitVertically(slot, w, h)
                ?? this.trySplitHorizontally(slot, w, h);
            if (splitAttempt) {
                return splitAttempt;
            }
        }
        //  Return that slot if we can't split it further
        return slot;
    }
    listSlots() {
        this.textureSlots.forEach((node) => {
            console.log(node.key?.getTag());
        });
    }
}
//# sourceMappingURL=TextureSlotAllocator.js.map