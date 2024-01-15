import { Handlers } from "$fresh/server.ts";
import { getBookIdFromTitleMemoized } from "@data";
import { API_MAX_BOOK_ID, API_MAX_ID, API_MIN_BOOK_ID, API_MIN_ID, SQ_KEYS } from "@lib/constants.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { escapeSql } from "escape";

export const handler: Handlers = {
  GET(req, ctx) {
    try {
      const { id } = ctx.params;
      const cleanId = escapeSql(id);

      const res = deleteInessentialsFromUrl(new URL(req.url));
      res.pathname = "/bible";

      // check if id is a book name...
      const bookId = getBookIdFromTitleMemoized(cleanId);
      if (bookId && !isNaN(bookId) && bookId >= API_MIN_BOOK_ID && bookId <= API_MAX_BOOK_ID) {
        res.searchParams.set(SQ_KEYS.START_FROM, `${bookId}001001`);
        return Response.redirect(res.toString(), 302);
      }

      // ... or a verse id
      const idInt = parseInt(cleanId, 10);
      if (!idInt || isNaN(idInt) || idInt < API_MIN_ID || idInt > API_MAX_ID) {
        return ctx.renderNotFound({ message: `Verse "${cleanId}" not found. Try again.` });
      }
      res.searchParams.set(SQ_KEYS.START_FROM, cleanId);
      return Response.redirect(res.toString(), 302);
    } catch (err) {
      console.error(err);
      return ctx.renderNotFound({ message: "Something went wrong. Try again." });
    }
  },
};
