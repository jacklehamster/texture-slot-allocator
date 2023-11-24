import { DEFAULT_MAX_TEXTURE_SIZE, DEFAULT_MIN_TEXTURE_SIZE } from "./TextureSlotAllocator";

export type TextureSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | number;
export type TextureIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

export interface Slot {
  readonly size: [TextureSize, TextureSize];
  readonly slotNumber: number;
  readonly x: number, y: number;
  readonly textureIndex: TextureIndex;
}

export class TextureSlot implements Slot {
  readonly size: [TextureSize, TextureSize];
  readonly slotNumber: number;
  readonly x: number;
  readonly y: number;
  readonly textureIndex: TextureIndex;
  readonly parent?: TextureSlot;
  sibbling?: TextureSlot;
  textureSizeLimits: { min: TextureSize, max: TextureSize };

  constructor(size: [TextureSize, TextureSize], slotNumber: number, parent?: TextureSlot, textureSizeLimits?: { min: TextureSize, max: TextureSize }) {
    this.textureSizeLimits = parent?.textureSizeLimits ?? textureSizeLimits ?? { min: DEFAULT_MIN_TEXTURE_SIZE, max: DEFAULT_MAX_TEXTURE_SIZE }
    this.size = size;
    this.slotNumber = slotNumber;
    this.parent = parent;
    this.sibbling = undefined;
    const { x, y, textureIndex } = this.calculatePosition(size, slotNumber);
    this.x = x;
    this.y = y;
    this.textureIndex = textureIndex;
  }

  calculateTextureIndex(size: [TextureSize, TextureSize], slotNumber: number): TextureIndex {
    const [w, h] = size;
    const slotsPerTexture = (this.textureSizeLimits.max / w) * (this.textureSizeLimits.max / h);
    return Math.floor(slotNumber / slotsPerTexture) as TextureIndex;
  }

  calculatePosition(size: [TextureSize, TextureSize], slotNumber: number) {
    const [w, h] = size;
    const slotsPerRow = this.textureSizeLimits.max / w;
    const slotsPerColumn = this.textureSizeLimits.max / h;
    const x = (slotNumber % slotsPerRow) * w;
    const y = (Math.floor(slotNumber / slotsPerRow) % slotsPerColumn) * h;
    return { x, y, textureIndex: this.calculateTextureIndex(size, slotNumber) };
  }

  getTag() {
    return TextureSlot.getTag(this);
  }

  static getTag(slot: Slot) {
    return `${slot.size[0]}x${slot.size[1]}-#${slot.slotNumber}-[${slot.textureIndex}]`;
  }

  static positionToTextureSlot(x: number, y: number, size: [TextureSize, TextureSize], textureIndex: TextureIndex, parent: TextureSlot): TextureSlot {
    const [w, h] = size;
    const slotsPerRow = parent.textureSizeLimits.max / w;
    const slotsPerTexture = (parent.textureSizeLimits.max / w) * (parent.textureSizeLimits.max / h);
    const slotNumber = slotsPerTexture * textureIndex + (y / h) * slotsPerRow + (x / w);
    return new TextureSlot(size, slotNumber, parent);
  }

  getPosition() {
    return { x: this.x, y: this.y, size: this.size, textureIndex: this.textureIndex };
  }

  canSplitHorizontally() {
    const [, h] = this.size;
    return h > this.textureSizeLimits.min;
  }

  canSplitVertically() {
    const [w,] = this.size;
    return w > this.textureSizeLimits.min;
  }

  splitHorizontally(): [TextureSlot, TextureSlot] {
    const { x, y, size, textureIndex } = this;
    const [w, h] = size;
    if (!this.canSplitHorizontally()) {
      throw new Error(`Cannot split texture slot of size ${w} horizontally`);
    }
    const halfWidth = w / 2;
    const left = TextureSlot.positionToTextureSlot(x, y, [halfWidth, h], textureIndex, this);
    const right = TextureSlot.positionToTextureSlot(x + halfWidth, y, [halfWidth, h], textureIndex, this);
    left.sibbling = right;
    right.sibbling = left;
    return [left, right];
  }

  splitVertically(): [TextureSlot, TextureSlot] {
    const { x, y, size, textureIndex } = this;
    const [w, h] = size;
    if (!this.canSplitVertically()) {
      throw new Error(`Cannot split texture slot of size ${h} vertically`);
    }
    const halfHeight = h / 2;
    const top = TextureSlot.positionToTextureSlot(x, y, [w, halfHeight], textureIndex, this);
    const bottom = TextureSlot.positionToTextureSlot(x, y + halfHeight, [w, halfHeight], textureIndex, this);
    top.sibbling = bottom;
    bottom.sibbling = top;
    return [top, bottom];
  }
}
