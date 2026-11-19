import { cp, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const source = new URL("dist/client/", root);
const index = new URL("index.html", source);
const assets = new URL("pages-assets/", source);

const html = await readFile(index, "utf8");
await cp(assets, new URL("pages-assets/", root), { recursive: true });
// Preserve the TanStack hydration script's route IDs through HTML parsing.
await writeFile(new URL("index.html", root), html.replaceAll("\0", "\\u0000"));
await writeFile(new URL(".nojekyll", root), "");
