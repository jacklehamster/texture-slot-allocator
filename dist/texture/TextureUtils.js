//  This returns the smallest size that is a power of 2 and is larger than the given size
export function getMinTextureSlotSize(size, minSize) {
    return Math.max(minSize, Math.pow(2, Math.ceil(Math.log(size) / Math.log(2))));
}
//  This rearranges the 'count' sprites into various sprite sheets
export function getFlexSizes(w, h, count, textureSizeLimits) {
    if (count < 1) {
        throw new Error("Invalid count");
    }
    const wFixed = getMinTextureSlotSize(w, textureSizeLimits.min), hFixed = getMinTextureSlotSize(h, textureSizeLimits.min);
    const flexSizes = new Map();
    let wSize = textureSizeLimits.min;
    for (let i = 1; i <= count; i++) {
        wSize = getMinTextureSlotSize(wFixed * i, textureSizeLimits.min);
        const hSize = getMinTextureSlotSize(hFixed * Math.ceil(count / i), textureSizeLimits.min);
        flexSizes.set(wSize, hSize);
    }
    for (let size = wSize; size <= textureSizeLimits.max; size *= 2) {
        if (!flexSizes.has(size)) {
            flexSizes.set(size, hFixed);
        }
    }
    return flexSizes;
}
//# sourceMappingURL=TextureUtils.js.map