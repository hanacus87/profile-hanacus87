import { describe, expect, test } from "bun:test";
import { renderHeadersFile } from "../../scripts/gen-headers";

describe("public/_headers と config の同期", () => {
  test("public/_headers が headers.config から再生成した内容と一致する", async () => {
    const committed = await Bun.file("public/_headers").text();
    expect(committed).toBe(renderHeadersFile());
  });
});
