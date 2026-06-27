import { beforeEach, describe, expect, mock, test } from "bun:test";
import { initWhoamiModal } from "../../client/whoami";

function bodyInner(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}

async function loadPage(): Promise<void> {
  const html = await Bun.file("public/index.html").text();
  document.body.className = "";
  document.body.innerHTML = bodyInner(html).replace(
    /<script[\s\S]*?<\/script>/gi,
    "",
  );
}

function jsonResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fakeFetch(data: unknown, status: number) {
  return mock((_input: string, _init?: RequestInit) =>
    Promise.resolve(jsonResponse(data, status)),
  );
}

const SOLVED = { ok: true, reveal: "<whoami>Im hanacus87 :)</whoami>" };

function flush(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}
function isOpen(): boolean {
  return el<HTMLDialogElement>("whoami-modal").hasAttribute("open");
}
function submitForm(): void {
  el<HTMLDialogElement>("whoami-modal")
    .querySelector("form")
    ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

beforeEach(loadPage);

describe("Who was I? モーダルの開閉", () => {
  test("hana-disc をクリックするとモーダルが開く", () => {
    initWhoamiModal(document, fakeFetch({ ok: false }, 401));
    el("hana-disc").click();
    expect(isOpen()).toBe(true);
  });

  test("モーダル外（backdrop）クリックで閉じ フォーカスが hana-disc に戻る", () => {
    initWhoamiModal(document, fakeFetch({ ok: false }, 401));
    el("hana-disc").click();
    el<HTMLDialogElement>("whoami-modal").click();
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(el("hana-disc"));
  });

  test("モーダル内（入力欄）クリックでは閉じない", () => {
    initWhoamiModal(document, fakeFetch({ ok: false }, 401));
    el("hana-disc").click();
    el<HTMLInputElement>("whoami-input").click();
    expect(isOpen()).toBe(true);
  });

  test("Escape キーでモーダルが閉じ フォーカスが hana-disc に戻る", () => {
    initWhoamiModal(document, fakeFetch({ ok: false }, 401));
    el("hana-disc").click();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(el("hana-disc"));
  });
});

describe("回答の送信", () => {
  test("送信時に POST /api/whoami へ入力値を送る", async () => {
    const fetchMock = fakeFetch({ ok: false }, 401);
    initWhoamiModal(document, fetchMock);
    el("hana-disc").click();
    el<HTMLInputElement>("whoami-input").value = "guess";
    submitForm();
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/whoami");
    expect(init?.method).toBe("POST");
    expect(String(init?.body)).toContain("guess");
  });

  test("正解の応答後 モーダルが閉じ + 行に hanacus87 が現れ body.solved になる", async () => {
    expect(el("whoami-reveal").textContent).not.toContain("hanacus87");
    initWhoamiModal(document, fakeFetch(SOLVED, 200));
    el("hana-disc").click();
    el<HTMLInputElement>("whoami-input").value = "hibiscus";
    submitForm();
    await flush();
    expect(isOpen()).toBe(false);
    expect(el("whoami-reveal").textContent).toContain("hanacus87");
    expect(document.body.classList.contains("solved")).toBe(true);
  });

  test("不正解の応答後 + 行は変化せず solved にもならず そのまま閉じる", async () => {
    initWhoamiModal(document, fakeFetch({ ok: false }, 401));
    el("hana-disc").click();
    el<HTMLInputElement>("whoami-input").value = "hana";
    submitForm();
    await flush();
    expect(el("whoami-reveal").textContent).not.toContain("hanacus87");
    expect(document.body.classList.contains("solved")).toBe(false);
    expect(isOpen()).toBe(false);
  });
});
