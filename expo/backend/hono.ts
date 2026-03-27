import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

app.get("/", (c) => c.json({ status: "ok", message: "API is running" }));

app.get("/oauth/callback/:provider", (c) => {
  const provider = c.req.param("provider");
  const url = new URL(c.req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    params[k] = v;
  });
  console.log(`[OAuth] Callback for ${provider}`, params);
  return c.json({ ok: true, provider, received: params });
});

app.post("/oauth/callback/:provider", async (c) => {
  const provider = c.req.param("provider");
  let body: any = {};
  try {
    body = await c.req.json();
  } catch {}
  console.log(`[OAuth] POST Callback for ${provider}`, body);
  return c.json({ ok: true, provider, received: body });
});

export default app;
