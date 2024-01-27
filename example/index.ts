import { TextureSlotAllocator } from "texture-slot-allocator";
import Bao from "baojs";
import serveStatic from "serve-static-bun";

const app = new Bao();
const props = {
  numTextureSheets: 1,
  maxTextureSize: 512,
  minTextureSize: 16,
};
const allocator = new TextureSlotAllocator(props);
const slot = allocator.allocate(20, 5);
console.log("Slot", slot);

app.get("/*any", serveStatic("/", { middlewareMode: "bao" }));

const server = app.listen({ port: 3000 });
console.log(`Listening on http://localhost:${server.port}`);
