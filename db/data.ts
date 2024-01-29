import { API_MAX_BOOK_ID } from "@lib/constants.ts";
import { Pericope, VerseId } from "@lib/types.ts";
import { getRefFromId, memoizeWithLimitedHistory } from "@lib/utils.ts";
import BOOK_INFO from "./book_info.json" assert { type: "json" };
import BOOK_TITLES from "./book_titles.json" assert { type: "json" };
import PERICOPES from "./pericopes.json" assert { type: "json" };

const bookTitleEntries = Object.entries(BOOK_TITLES);

export const listOfBooks: [api: string, short: string][] = BOOK_INFO.map(({ title_short }) => {
  return [title_short.replaceAll(/[^a-zA-Z0-9]/g, ""), title_short];
});

export const getNoOfChapters = (book: number): number => {
  const bookInfo = BOOK_INFO[book];
  if (!bookInfo) return NaN;
  return bookInfo.chapters;
};

export const getNoOfVerses = (book: number, chapter: number): number => {
  const bookInfo = BOOK_INFO[book];
  if (!bookInfo) return NaN;
  const chapterInfo = bookInfo.verses[chapter];
  if (!chapterInfo) return NaN;
  return chapterInfo;
};

export function getBookIdFromTitle(title: string): number | undefined {
  const norm = title.replace(/\s+/g, "");
  const pattern = new RegExp(`^${norm}$`, "gi");
  const book = bookTitleEntries.filter(([_id, t]) => {
    if (t.some((t) => pattern.test(t))) return true;
    return false;
  })[0];
  if (!book || !book[0]) return undefined;
  return parseInt(book[0], 10);
}

export const getBookIdFromTitleMemoized = memoizeWithLimitedHistory(getBookIdFromTitle, 66);

export function getPericopesForBook(book: number): Pericope[] {
  return PERICOPES.filter((p) => p.r[0] >= parseInt(`${book}000000`, 10) && p.r[0] <= parseInt(`${book}999999`, 10));
}

export const getPericopesForBookMemoized: (book: number) => Pericope[] = memoizeWithLimitedHistory(
  getPericopesForBook,
  API_MAX_BOOK_ID,
);

export function getPericopeFromId(id: VerseId): Pericope | undefined {
  const [book] = getRefFromId(id);
  const pericopes = getPericopesForBook(book);
  for (const pericope of pericopes) {
    const { r } = pericope;
    const [start, end] = r;
    if (start <= id && id <= end) {
      return pericope;
    }
  }
}

export const getPericopeFromIdMemoized: (id: VerseId) => Pericope | undefined = memoizeWithLimitedHistory(
  getPericopeFromId,
  100,
);
