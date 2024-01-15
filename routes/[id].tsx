import type { Handlers } from "$fresh/server.ts";
import { ROUTES_WHITELIST } from "@lib/constants.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const id = ctx.params.id.toLowerCase().trim();
    if (!id || ROUTES_WHITELIST.includes(id)) {
      return ctx.next();
    }
    const url = new URL(req.url);
    url.pathname = `/bible/${id}`;
    return Response.redirect(url, 302);
  },
};
