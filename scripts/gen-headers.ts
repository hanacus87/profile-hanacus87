import { ASSET_CACHE_RULES, SECURITY_HEADERS } from "../src/lib/headers.config";

function renderBlock(path: string, headers: Record<string, string>): string {
  const lines = Object.entries(headers).map(
    ([name, value]) => `  ${name}: ${value}`,
  );
  return [path, ...lines].join("\n");
}

export function renderHeadersFile(): string {
  const blocks = [
    renderBlock("/*", SECURITY_HEADERS),
    ...ASSET_CACHE_RULES.map((rule) => renderBlock(rule.path, rule.headers)),
  ];
  return `${blocks.join("\n\n")}\n`;
}

if (import.meta.main) {
  await Bun.write("public/_headers", renderHeadersFile());
}
