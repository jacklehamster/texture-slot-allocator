import { beforeEach, describe, expect, it } from 'bun:test';
import { TextureSlot, TextureIndex } from './TextureSlot';

const MIN_TEXTURE_SIZE = 16;
const MAX_TEXTURE_SIZE = 4096;

describe('TextureSlot', () => {
  let slot: TextureSlot;

  beforeEach(() => {
    slot = new TextureSlot([2 * MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE], 0);
  });

  it('should correctly calculate the texture position', () => {
    const slot = new TextureSlot([2 * MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE], 20);
    const slotsPerRow = MAX_TEXTURE_SIZE / (2 * MIN_TEXTURE_SIZE);
    const slotsPerColumn = MAX_TEXTURE_SIZE / (2 * MIN_TEXTURE_SIZE);
    const expectedX = (20 % slotsPerRow) * (2 * MIN_TEXTURE_SIZE);
    const expectedY = (Math.floor(20 / slotsPerColumn) % slotsPerRow) * (2 * MIN_TEXTURE_SIZE);
    const expectedPosition: { x: number, y: number, size: [number, number], textureIndex: TextureIndex } = { x: expectedX, y: expectedY, size: [2 * MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE], textureIndex: slot.textureIndex };
    expect(slot.getPosition()).toEqual(expectedPosition);
  });

  it('should correctly convert a position to a texture slot', () => {
    const parentSlot = new TextureSlot([MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE], 0, undefined, { min: MIN_TEXTURE_SIZE, max: MAX_TEXTURE_SIZE });
    const position = { x: MIN_TEXTURE_SIZE, y: 2 * MIN_TEXTURE_SIZE, size: [2 * MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE] as [number, number], textureIndex: 1 as TextureIndex };
    const slot = TextureSlot.positionToTextureSlot(position.x, position.y, position.size, position.textureIndex, parentSlot);
    const slotsPerRow = MAX_TEXTURE_SIZE / (2 * MIN_TEXTURE_SIZE);
    const slotsPerTexture = (MAX_TEXTURE_SIZE / (2 * MIN_TEXTURE_SIZE)) * (MAX_TEXTURE_SIZE / (2 * MIN_TEXTURE_SIZE));
    const expectedSlotNumber = slotsPerTexture * position.textureIndex + (position.y / (2 * MIN_TEXTURE_SIZE)) * slotsPerRow + (position.x / (2 * MIN_TEXTURE_SIZE));
    expect(slot.slotNumber).toBe(expectedSlotNumber);
  });

  it('should split a slot horizontally', () => {
    const [left, right] = slot.splitHorizontally();
    expect(left.getPosition()).toEqual({ x: 0, y: 0, size: [MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE], textureIndex: 0 });
    expect(right.getPosition()).toEqual({ x: MIN_TEXTURE_SIZE, y: 0, size: [MIN_TEXTURE_SIZE, 2 * MIN_TEXTURE_SIZE], textureIndex: 0 });
    expect(left.sibbling).toBe(right);
    expect(right.sibbling).toBe(left);
  });

  it('should split a slot vertically', () => {
    const [top, bottom] = slot.splitVertically();
    expect(top.getPosition()).toEqual({ x: 0, y: 0, size: [2 * MIN_TEXTURE_SIZE, MIN_TEXTURE_SIZE], textureIndex: 0 });
    expect(bottom.getPosition()).toEqual({ x: 0, y: MIN_TEXTURE_SIZE, size: [2 * MIN_TEXTURE_SIZE, MIN_TEXTURE_SIZE], textureIndex: 0 });
    expect(top.sibbling).toBe(bottom);
    expect(bottom.sibbling).toBe(top);
  });

  it('should throw an error when trying to split a slot that is too small', () => {
    const smallSlot = new TextureSlot([MIN_TEXTURE_SIZE, MIN_TEXTURE_SIZE], 0);
    expect(() => smallSlot.splitHorizontally()).toThrow(`Cannot split texture slot of size ${MIN_TEXTURE_SIZE} horizontally`);
    expect(() => smallSlot.splitVertically()).toThrow(`Cannot split texture slot of size ${MIN_TEXTURE_SIZE} vertically`);
  });
});
