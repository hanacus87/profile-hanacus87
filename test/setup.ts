import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({ url: "https://hanacus87.net/" });

const { afterEach } = await import("bun:test");

afterEach(() => {
  document.body.innerHTML = "";
});
