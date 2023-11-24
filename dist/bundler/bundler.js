async function bundle() {
    await Bun.build({
        entrypoints: ['./src/index.ts'],
        outdir: './build',
        minify: true,
        sourcemap: "external",
        target: "browser",
    });
}
await bundle();
export {};
//# sourceMappingURL=bundler.js.map