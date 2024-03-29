// To recognize dom types (see https://bun.sh/docs/typescript#dom-types):
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import AVLTree from 'avl';
import { Slot, TextureSize, TextureSlot } from './TextureSlot';
import { getFlexSizes } from './TextureUtils';
import { ITextureSlotAllocator } from './ITextureSlotAllocator';

const DEBUG = false;
export const DEFAULT_MIN_TEXTURE_SIZE = 16;
export const DEFAULT_MAX_TEXTURE_SIZE = 4096;
export const DEFAULT_NUM_TEXTURE_SHEETS = 16;

export interface Props {
  numTextureSheets?: number;
  minTextureSize?: TextureSize;
  maxTextureSize?: TextureSize;
  excludeTexture?: (textureIndex: number) => boolean;
}

export class TextureSlotAllocator implements ITextureSlotAllocator {
  //  AVL tree of texture slots, sorted by size
  textureSlots = new AVLTree<TextureSlot, TextureSlot>((slot1, slot2) => {
    const sizeDiff = slot1.size[0] * slot1.size[1] - slot2.size[0] * slot2.size[1];
    if (sizeDiff !== 0) {
      return sizeDiff;
    }
    return slot1.slotNumber - slot2.slotNumber;
  }, false);

  private allocatedTextures: Record<string, TextureSlot> = {};
  minTextureSize: TextureSize;
  maxTextureSize: TextureSize;
  numTextureSheets: number;
  private readonly initialSlots: TextureSlot[] = [];

  constructor({ numTextureSheets, minTextureSize, maxTextureSize, excludeTexture }: Props = {}, gl?: WebGL2RenderingContext) {
    this.numTextureSheets = numTextureSheets ?? DEFAULT_NUM_TEXTURE_SHEETS;
    this.minTextureSize = minTextureSize ?? DEFAULT_MIN_TEXTURE_SIZE;
    this.maxTextureSize = maxTextureSize ?? DEFAULT_MAX_TEXTURE_SIZE;

    if (gl) {
      this.numTextureSheets = Math.min(this.numTextureSheets, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS));
      this.maxTextureSize = Math.min(this.maxTextureSize, gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_SIZE));
      this.minTextureSize = Math.min(this.minTextureSize, this.maxTextureSize);
    }

    for (let i = 0; i < this.numTextureSheets; i++) {
      if (excludeTexture?.(i)) {
        continue;
      }
      this.initialSlots.push(new TextureSlot([this.maxTextureSize, this.maxTextureSize], i, undefined, {
        min: this.minTextureSize,
        max: this.maxTextureSize,
      }));
    }

    this.initialSlots.forEach(slot => this.textureSlots.insert(slot));
  }

  allocate(w: number, h: number, count: number = 1): Slot {
    const { size, slotNumber, x, y, textureIndex } = this.allocateHelper(w, h, count);
    return { size, slotNumber, x, y, textureIndex };
  }

  deallocate(slot: Slot): void {
    if (!this.isSlotUsed(slot)) {
      throw new Error('Slot is not allocated');
    }
    const textureSlot = this.allocatedTextures[TextureSlot.getTag(slot)];
    this.deallocateHelper(textureSlot);
  }

  get countUsedTextureSheets(): number {
    return this.initialSlots.filter(slot => this.isSlotUsed(slot)).length;
  }

  private allocateHelper(w: number, h: number, count: number = 1): TextureSlot {
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

  private findSlot(flexSizes: Map<TextureSize, TextureSize>): TextureSlot | null {
    for (let i = 0; i < this.textureSlots.size; i++) {
      const slot = this.textureSlots.at(i);
      const textureSlot = slot!.key!;
      const [w, h] = textureSlot.size;
      if (flexSizes.get(w)! <= h) {
        return textureSlot;
      }
    }
    return null;
  }

  private calculateRatio(w: number, h: number): number {
    return Math.max(w / h, h / w);
  }

  private bestFit(flexSizes: Map<TextureSize, TextureSize>, slot: TextureSlot): [TextureSize, TextureSize] {
    const [slotWidth, slotHeight] = slot.size;
    let bestWidth = slot.textureSizeLimits.max;
    flexSizes.forEach((hSize, wSize) => {
      if (wSize <= slotWidth && hSize <= slotHeight) {
        const product = wSize * hSize;
        const bestProduct = flexSizes.get(bestWidth)! * bestWidth;
        if (product < bestProduct) {
          bestWidth = wSize;
        } else if (product === bestProduct) {
          const ratio = this.calculateRatio(wSize, hSize);
          if (ratio < this.calculateRatio(bestWidth, flexSizes.get(bestWidth)!)) {
            bestWidth = wSize;
          }
        }
      }
    });
    return [bestWidth, flexSizes.get(bestWidth)!];
  }

  private isSlotUsed(slot: Slot): boolean {
    return !!this.allocatedTextures[TextureSlot.getTag(slot)];
  }

  private deallocateHelper(slot: TextureSlot): void {
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

  private trySplitHorizontally(slot: TextureSlot, w: number, h: number): TextureSlot | null {
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

  private trySplitVertically(slot: TextureSlot, w: number, h: number): TextureSlot | null {
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

  private fitSlot(slot: TextureSlot, w: number, h: number): TextureSlot {
    this.allocatedTextures[slot.getTag()] = slot;
    if (slot.size[0] > slot.size[1]) {
      const splitAttempt = this.trySplitHorizontally(slot, w, h)
        ?? this.trySplitVertically(slot, w, h);
      if (splitAttempt) {
        return splitAttempt;
      }
    } else {
      const splitAttempt = this.trySplitVertically(slot, w, h)
        ?? this.trySplitHorizontally(slot, w, h);
      if (splitAttempt) {
        return splitAttempt;
      }
    }
    //  Return that slot if we can't split it further
    return slot;
  }
}
