import { Slot, TextureSize } from "..";

export interface ITextureSlotAllocator {
  allocate(w: number, h: number, count?: number): Slot;
  deallocate(slot: Slot): void;
  get minTextureSize(): TextureSize;
  get maxTextureSize(): TextureSize;
}
