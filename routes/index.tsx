import type { Handlers } from "$fresh/server.ts";
import { SQ_KEYS } from "@lib/constants.ts";

export const handler: Handlers = {
  GET(req, _ctx) {
    const url = new URL(req.url);
    url.pathname = "/bible";
    url.searchParams.set(SQ_KEYS.RESUME, "1");
    return Response.redirect(url, 302);
  },
};
