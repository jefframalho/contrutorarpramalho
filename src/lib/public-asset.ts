export function publicAsset(path: string) {
  const directory = import.meta.env.MODE === "github-pages" ? "public/" : "";
  return `${import.meta.env.BASE_URL}${directory}${path.replace(/^\//, "")}`;
}
