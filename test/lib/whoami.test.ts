import { describe, expect, test } from "bun:test";
import { isCorrectAnswer } from "../../src/lib/whoami";

describe("正体の判定", () => {
  test("入力が hibiscus のとき 正解と判定する", () => {
    expect(isCorrectAnswer("hibiscus")).toBe(true);
  });

  test("前後に空白が付いた '  hibiscus  ' は不正解と判定する", () => {
    expect(isCorrectAnswer("  hibiscus  ")).toBe(false);
  });

  test("大文字の HIBISCUS は不正解と判定する", () => {
    expect(isCorrectAnswer("HIBISCUS")).toBe(false);
  });

  test("先頭だけ大文字の Hibiscus は不正解と判定する", () => {
    expect(isCorrectAnswer("Hibiscus")).toBe(false);
  });

  test("hana は不正解と判定する", () => {
    expect(isCorrectAnswer("hana")).toBe(false);
  });

  test("空文字は不正解と判定する", () => {
    expect(isCorrectAnswer("")).toBe(false);
  });
});
