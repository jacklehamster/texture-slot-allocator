async function bundle() {
  await Bun.build({
    entrypoints: ['./index.ts'],
    outdir: './dist',
    minify: true,
    sourcemap: "external",
    target: "browser",
  });
}

await bundle();

export { }
