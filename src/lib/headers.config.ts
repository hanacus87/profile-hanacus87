export const CONTENT_SECURITY_POLICY =
  "default-src 'self'; object-src 'none'; frame-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'";

const PERMISSIONS_POLICY =
  "accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), unload=()";

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": PERMISSIONS_POLICY,
  "X-Permitted-Cross-Domain-Policies": "none",
  "X-DNS-Prefetch-Control": "off",
};

export type AssetCacheRule = { path: string; headers: Record<string, string> };

export const ASSET_CACHE_RULES: AssetCacheRule[] = [
  {
    path: "/fonts/*",
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  },
  {
    path: "/icons/*",
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  },
];
