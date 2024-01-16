export type Opaque<T, K> = T & { __TYPE__: K };

export type VerseId = Opaque<number, "VerseRef">;

export type BibleRef = [b: number, c: number, v: number];

export type Translation = "asv" | "bbe" | "cut" | "kjv";

export type TranslationInfo = {
  title: string;
  value: Translation;
  flag: string;
  innerText: string;
};

export type Pericope = {
  sv: number;
  ev: number;
  o: number;
  t: string;
  r: number[];
};

export type BookInfo = {
  abbreviation: string;
  category: string;
  chapters: number;
  order: number;
  otnt: string;
  title_full: string;
  title_short: string;
};

export type CrossRef = [sv: number, ev: number, r: number];

export type Verse = [id: number, text: string];

export type BibleKvData = {
  books: BookInfo[];
  crossrefs: CrossRef[];
  translations: Record<Translation, Record<VerseId, string>>;
};

export type ApiParams = {
  translation: Translation;
  startFrom?: number;
  endAt?: number;
  pageSize: number;
  cursor?: string;
  idx?: number;
  resume?: boolean;
};

export type VerseExtras = {
  books: Record<number, BookInfo>;
  crossRefs: Record<number, Deno.KvEntry<string>[]>;
  pericopes: Record<number, Record<VerseId, Pericope>>;
};

export type VerseNextPageParams = {
  cursor: string;
  url: URL;
  fp: URL;
};

export type ApiResponse = ApiParams & {
  origin: URL | string;
  verses: Verse[];
  extras?: VerseExtras;
  next?: VerseNextPageParams;
};
