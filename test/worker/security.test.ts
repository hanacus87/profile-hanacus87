import { describe, expect, test } from "bun:test";
import { CONTENT_SECURITY_POLICY } from "../../src/lib/headers.config";
import { buildSecurityHeaders } from "../../src/lib/security";

describe("Content-Security-Policy の構築", () => {
  test("インラインスクリプトを許可しない（unsafe-inline を含めない）", () => {
    expect(CONTENT_SECURITY_POLICY).not.toContain("unsafe-inline");
  });

  test("default-src を self に限定する", () => {
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'");
  });

  test("外部画像ホストを許可しない（www.google.com・gstatic を含めない）", () => {
    const csp = CONTENT_SECURITY_POLICY;
    expect(csp).not.toContain("www.google.com");
    expect(csp).not.toContain("gstatic");
  });

  test("画像は default-src 'self' に委ね img-src を持たず script-src も緩めない", () => {
    const csp = CONTENT_SECURITY_POLICY;
    expect(csp).toContain("default-src 'self'");
    expect(csp).not.toContain("img-src");
    expect(csp).not.toContain("script-src");
  });

  test("フォーム送信先・プラグイン・フレーム読み込みを制限する", () => {
    const csp = CONTENT_SECURITY_POLICY;
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-src 'none'");
  });

  test("フレーム埋め込みを frame-ancestors none で禁止する", () => {
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'");
  });
});

describe("セキュリティヘッダー一式", () => {
  test("MIME スニッフィングを X-Content-Type-Options nosniff で禁止する", () => {
    expect(buildSecurityHeaders()["X-Content-Type-Options"]).toBe("nosniff");
  });

  test("クリックジャッキングを X-Frame-Options DENY で防ぐ", () => {
    expect(buildSecurityHeaders()["X-Frame-Options"]).toBe("DENY");
  });

  test("HSTS を 2 年・サブドメイン込み・preload で設定する", () => {
    expect(buildSecurityHeaders()["Strict-Transport-Security"]).toBe(
      "max-age=63072000; includeSubDomains; preload",
    );
  });

  test("Referrer-Policy を no-referrer にする", () => {
    expect(buildSecurityHeaders()["Referrer-Policy"]).toBe("no-referrer");
  });

  test("COOP と CORP を same-origin にする", () => {
    const headers = buildSecurityHeaders();
    expect(headers["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(headers["Cross-Origin-Resource-Policy"]).toBe("same-origin");
  });

  test("Permissions-Policy が camera・microphone・geolocation を空許可リストで拒否する", () => {
    const policy = buildSecurityHeaders()["Permissions-Policy"] ?? "";
    expect(policy).toContain("camera=()");
    expect(policy).toContain("microphone=()");
    expect(policy).toContain("geolocation=()");
  });
});
