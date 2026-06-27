import { describe, expect, test } from "bun:test";
import app from "../../src/index";

function postAnswer(answer: unknown) {
  return app.request("/api/whoami", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
}

describe("POST /api/whoami", () => {
  test("正解 hibiscus を送ると 200 を返す", async () => {
    const res = await postAnswer("hibiscus");
    expect(res.status).toBe(200);
  });

  test("正解時の応答に現在の自分を示す hanacus87 を含む reveal を返す", async () => {
    const res = await postAnswer("hibiscus");
    const body = (await res.json()) as { ok: boolean; reveal?: string };
    expect(body.ok).toBe(true);
    expect(body.reveal).toContain("hanacus87");
  });

  test("不正解 hana は 401 を返し ok を false にする", async () => {
    const res = await postAnswer("hana");
    expect(res.status).toBe(401);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(false);
  });

  test("大文字 HIBISCUS は完全一致でないため 401 を返す", async () => {
    const res = await postAnswer("HIBISCUS");
    expect(res.status).toBe(401);
  });

  test("answer が文字列でない場合も 401 を返す", async () => {
    const res = await postAnswer(42);
    expect(res.status).toBe(401);
  });

  test("不正解応答に報酬 reveal を含めない", async () => {
    const res = await postAnswer("hana");
    const body = (await res.json()) as { reveal?: string };
    expect(body.reveal).toBeUndefined();
  });

  test("不正解応答の本文に答えの平文 hibiscus を含めない", async () => {
    const res = await postAnswer("nope");
    expect(await res.text()).not.toContain("hibiscus");
  });

  test("API 応答は Cache-Control: no-store になる", async () => {
    const res = await postAnswer("hibiscus");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  test("API 応答に共通セキュリティヘッダー（CSP）が付与される", async () => {
    const res = await postAnswer("hibiscus");
    expect(res.headers.get("Content-Security-Policy")).toBeTruthy();
  });
});

describe("配信される初期 HTML", () => {
  test("答えの平文 hibiscus を含めない（ページ上では露出しない）", async () => {
    const html = await Bun.file("public/index.html").text();
    expect(html).not.toContain("hibiscus");
  });

  test("謎として MD5 ハッシュ ec07d733… を含む", async () => {
    const html = await Bun.file("public/index.html").text();
    expect(html).toContain("ec07d733adeecee47a5573f257db6005");
  });
});
