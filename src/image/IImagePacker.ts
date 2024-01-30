import { Props } from "@/texture/TextureSlotAllocator";
import { PackResult } from "./ImagePacker";

export interface IImagePacker {
  addImage(id: string, image: CanvasImageSource, cols?: number, rows?: number): void;
  pack(props?: Props): Promise<PackResult>;
  clear(): void;
}
