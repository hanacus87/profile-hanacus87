import { Hono } from "hono";
import { applySecurityHeaders } from "./lib/security";
import { REVEAL_ANSWER, isCorrectAnswer } from "./lib/whoami";

const app = new Hono();

app.use("*", async (c, next) => {
  await next();
  applySecurityHeaders(c.res.headers);
});

app.post("/api/whoami", async (c) => {
  c.header("Cache-Control", "no-store");
  let answer = "";
  try {
    const body = (await c.req.json()) as { answer?: unknown };
    if (typeof body.answer === "string") {
      answer = body.answer;
    }
  } catch {
    answer = "";
  }
  if (!isCorrectAnswer(answer)) {
    return c.json({ ok: false }, 401);
  }
  return c.json({ ok: true, reveal: REVEAL_ANSWER });
});

export default app;
