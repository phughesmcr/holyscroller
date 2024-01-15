/// <reference lib="deno.unstable" />

import { API_DEFAULT_TRANSLATION, DB_LOCAL_PATH, KV_PATHS } from "@lib/constants.ts";
import type { ApiParams, BookInfo, CrossRef, Translation, Verse, VerseExtras } from "@lib/types.ts";
import { cleanId, cleanParams } from "@lib/utils.ts";
import { escapeSql } from "escape";

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
const db = await Deno.openKv(isDenoDeploy ? undefined : DB_LOCAL_PATH);

globalThis.addEventListener("unload", () => db?.close(), { passive: true });
globalThis.addEventListener("unhandledrejection", () => db?.close(), { passive: true });

/**
 * @param idx The 1-based book index (e.g. 1 for Genesis, 2 for Exodus, etc.)
 */
export const getBookInfo = (idx: number): Promise<BookInfo | null> => {
  const cleanedId = cleanId(idx);
  if (!cleanedId) return Promise.reject("Invalid id");
  return db.get<BookInfo>([KV_PATHS.BOOKS, cleanedId]).then((res) => res.value);
};

/**
 * @param id The verse id (e.g. 1001001 for Genesis 1:1)
 */
export const getCrossRef = (id: number): Promise<CrossRef[] | null> => {
  const cleanedId = cleanId(id);
  if (!cleanedId) return Promise.reject("Invalid id");
  return db.get<CrossRef[]>([KV_PATHS.CROSSREFS, cleanedId]).then((res) => res.value);
};

/**
 * @param id The verse id (e.g. 1001001 for Genesis 1:1)
 */
export const getVerse = (translation: Translation, id: number): Promise<string | null> => {
  const cleanedTranslation = escapeSql(translation);
  const cleanedId = cleanId(id);
  if (!cleanedId) return Promise.reject("Invalid id");
  return db.get<string>([KV_PATHS.TRANSLATIONS, cleanedTranslation, cleanedId]).then((res) => res.value);
};

export const getPageOfVerses = (params: ApiParams) => {
  const { translation, startFrom, endAt, pageSize, cursor } = cleanParams(params);
  const basePath: Deno.KvKey = [KV_PATHS.TRANSLATIONS, translation];
  const start: Deno.KvKey | undefined = startFrom ? [...basePath, startFrom] : undefined;
  const end: Deno.KvKey | undefined = endAt ? [...basePath, endAt] : undefined;
  const prefix: Deno.KvKey | undefined = (start && end) ? undefined : [KV_PATHS.TRANSLATIONS, translation];
  // @ts-ignore: undefined is fine for now (TODO)
  return db.list<string>({ prefix, start, end }, { limit: pageSize, cursor: cursor });
};

/* export const getPericopesForBook = (book: number): Deno.KvListIterator<Pericope> => {
  return db.list<Pericope>({
    start: [KV_PATHS.PERICOPES, `${book}001001`],
    end: [KV_PATHS.PERICOPES, `${book}999999`],
  });
};

export const getPericopeFromId = async (id: number): Promise<Pericope | undefined> => {
  const cleanedId = cleanId(id);
  if (!cleanedId) return undefined;
  const [book] = getRefFromId(cleanedId);
  const pericopes = getPericopesForBook(book);
  for await (const pericope of pericopes) {
    const { r } = pericope.value;
    const [start, end] = r;
    if (start <= cleanedId && cleanedId <= end) return pericope.value;
  }
}; */

export const getExtrasForVerses: (verses: Verse[]) => Promise<VerseExtras> = async (
  verses: Verse[],
  _t = API_DEFAULT_TRANSLATION,
): Promise<VerseExtras> => {
  const res: VerseExtras = { books: {}, crossRefs: {}, pericopes: {} };

  // BOOKS & BOOK PERICOPES
  const books = [...new Set(verses.map(([id, _text]) => parseInt(id.toString().padStart(8, "0").substring(0, 2), 10)))];
  for (const book of books) {
    // BOOKINFO
    // TODO: internationalisation support
    const info = await db.get<BookInfo>([KV_PATHS.BOOKS, book]).then((res) => res.value);
    if (info) res.books[book] = info;
  }

  // VERSE EXTRAS - CROSSREFS & PERICOPES
  /* for (const [id, _text] of verses) {
    const cleanedId = cleanId(id);
    if (!cleanedId) continue;
    // CROSSREFS
    const refInfo = await db.get<CrossRef[]>([KV_PATHS.CROSSREFS, cleanedId]).then((res) => res.value);
    if (refInfo) {
      // sort by rank
      refInfo.sort((a, b) => a[2] - b[2]);
      const crossRefs: Deno.KvEntry<string>[] = [];
      for (const info of refInfo) {
        const [sv, ev] = info;
        const refVerse = await db.list<string>({
          start: [KV_PATHS.TRANSLATIONS, t, sv],
          end: [KV_PATHS.TRANSLATIONS, t, ev],
        });
        for await (const verse of refVerse) {
          crossRefs.push(verse);
        }
      }
      res.crossRefs[cleanedId] = crossRefs;
    }
    // PERICOPES
    const [book] = getRefFromId(cleanedId);
    const pericopes = bookPericopes.get(book);
    if (pericopes) {
      const
      for (const pericope in pericopes) {
        const { sv, ev } = pericope;
        if (sv <= cleanedId && cleanedId <= ev) {
          res.pericopes[cleanedId] = pericope.t;
          break;
        }
      }
    }
  } */

  return res;
};
