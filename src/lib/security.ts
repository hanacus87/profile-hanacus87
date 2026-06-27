import { SECURITY_HEADERS } from "./headers.config";

export function buildSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS };
}

export function applySecurityHeaders(target: Headers): void {
  for (const [name, value] of Object.entries(buildSecurityHeaders())) {
    target.set(name, value);
  }
}
