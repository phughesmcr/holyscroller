// deno-lint-ignore-file no-explicit-any
import {
  API_DEFAULT_PAGE_SIZE,
  API_DEFAULT_TRANSLATION,
  API_MAX_ID,
  API_MAX_PAGE_SIZE,
  API_MIN_ID,
  API_MIN_PAGE_SIZE,
  LS_KEYS,
  NOOP_CURSOR,
  SQ_KEYS,
} from "./constants.ts";

import type { ApiParams, BibleRef, Translation, VerseId } from "@lib/types.ts";
import { escapeSql } from "escape";

// VerseRef helpers

export function getStringFromId(id: VerseId): string {
  return id.toString().padStart(8, "0");
}

export function isValidId(id: number): id is VerseId {
  return Number.isInteger(id) && id >= API_MIN_ID && id <= API_MAX_ID;
}

export function getHexFromRef(book: number, chapter: number, verse: number): string {
  const hexBook = book.toString(16).padStart(2, "0").toUpperCase();
  const hexChapter = chapter.toString(16).padStart(2, "0").toUpperCase();
  const hexVerse = verse.toString(16).padStart(2, "0").toUpperCase();
  return `#${hexBook}${hexChapter}${hexVerse}`;
}

export function getRefFromHex(hexColorString: string): BibleRef {
  const hexBook = parseInt(hexColorString.substring(1, 3), 16);
  const hexChapter = parseInt(hexColorString.substring(3, 5), 16);
  const hexVerse = parseInt(hexColorString.substring(5, 7), 16);
  return [hexBook, hexChapter, hexVerse];
}

export function getIdFromRef(book: number, chapter: number, verse: number): VerseId | undefined {
  // BBCCCVVV
  const bookStr = book.toString().padStart(2, "0");
  const chapterStr = chapter.toString().padStart(3, "0");
  const verseStr = verse.toString().padStart(3, "0");
  const id = parseInt(`${bookStr}${chapterStr}${verseStr}`, 10);
  if (isValidId(id)) return id;
  return undefined;
}

export function getRefFromId(id: VerseId): BibleRef {
  // BCCCVVV or BBCCCVVV
  const idStr = getStringFromId(id);
  const book = parseInt(idStr.substring(0, 2), 10);
  const chapter = parseInt(idStr.substring(2, 5), 10);
  const verse = parseInt(idStr.substring(5, 8), 10);
  return [book, chapter, verse];
}

// API helpers

export function conformTranslation(params: URLSearchParams): Translation | null {
  const translation = params.get(SQ_KEYS.TRANSLATION);
  if (!translation) return null;
  const cleanedTranslation = escapeSql(translation.toLowerCase().trim());
  switch (cleanedTranslation) {
    case "asv":
    case "bbe":
    case "cut":
    case "kjv":
      return cleanedTranslation;
    default:
      return null;
  }
}

export function conformPageSize(params: URLSearchParams): number | null {
  const pageSize = params.get(SQ_KEYS.PAGE_SIZE);
  if (!pageSize) return null;
  const cleanedPageSize = Math.abs(parseInt(escapeSql(pageSize.trim()), 10));
  if (isNaN(cleanedPageSize)) return null;
  return clamp(
    cleanedPageSize,
    API_MIN_PAGE_SIZE,
    API_MAX_PAGE_SIZE,
  );
}

export function conformStartFrom(params: URLSearchParams): VerseId | undefined | null {
  const startFrom = params.get(SQ_KEYS.START_FROM);
  if (!startFrom) return undefined;
  const cleanedStartFrom = Math.abs(parseInt(escapeSql(startFrom.trim()), 10));
  if (isNaN(cleanedStartFrom)) return null;
  const clamped = clamp(cleanedStartFrom, API_MIN_ID, API_MAX_ID);
  return isValidId(clamped) ? clamped : null;
}

export function conformEndAt(params: URLSearchParams): VerseId | undefined | null {
  const endAt = params.get(SQ_KEYS.END_AT);
  if (!endAt) return undefined;
  const cleanedEndAt = Math.abs(parseInt(escapeSql(endAt.trim()), 10));
  if (isNaN(cleanedEndAt)) return null;
  const clamped = clamp(cleanedEndAt, API_MIN_ID, API_MAX_ID);
  return isValidId(clamped) ? clamped : null;
}

export function conformCursor(params: URLSearchParams): string | undefined | null {
  const cursor = params.get(SQ_KEYS.CURSOR);
  if (!cursor) return undefined;
  const cleanedCursor = escapeSql(cursor.trim());
  if (!cleanedCursor) return null;
  return cleanedCursor;
}

export function conformResume(params: URLSearchParams): boolean | null {
  const resume = params.get(SQ_KEYS.RESUME);
  if (!resume) return null;
  const cleanedResume = escapeSql(resume.trim());
  return cleanedResume === "1";
}

export function getApiParamsFromUrl(url: string | URL): ApiParams {
  const { searchParams } = new URL(url);
  const translation = conformTranslation(searchParams) || API_DEFAULT_TRANSLATION;
  const pageSize = conformPageSize(searchParams) || API_DEFAULT_PAGE_SIZE;
  const startFrom = conformStartFrom(searchParams) || undefined;
  const endAt = conformEndAt(searchParams) || undefined;
  const cursor = conformCursor(searchParams) || undefined;
  const resume = conformResume(searchParams) || false;
  return { translation, startFrom, endAt, cursor, pageSize, resume };
}

export function setApiParamsInUrl(url: string | URL, params: ApiParams): URL {
  const { translation, startFrom, endAt, cursor, pageSize } = params;
  const res = new URL(url);
  const { searchParams } = res;
  searchParams.set(SQ_KEYS.TRANSLATION, translation || API_DEFAULT_TRANSLATION);
  searchParams.set(SQ_KEYS.PAGE_SIZE, pageSize?.toString() || API_DEFAULT_PAGE_SIZE.toString());
  if (startFrom) searchParams.set(SQ_KEYS.START_FROM, startFrom.toString() || "");
  if (endAt) searchParams.set(SQ_KEYS.END_AT, endAt.toString() || "");
  if (cursor) {
    if (cursor === NOOP_CURSOR) {
      searchParams.delete(SQ_KEYS.CURSOR);
    } else {
      searchParams.set(SQ_KEYS.CURSOR, cursor);
    }
  }
  return res;
}

export function cleanParams(params: ApiParams): ApiParams {
  const { translation, startFrom, endAt, pageSize, cursor, resume } = params;
  const cleanedTranslation = translation ? escapeSql(translation) : API_DEFAULT_TRANSLATION;
  const cleanedPageSize = parseInt(escapeSql((pageSize || API_DEFAULT_PAGE_SIZE).toString()), 10);
  const cleanedStartFrom = startFrom ? parseInt(escapeSql(startFrom.toString()), 10) : undefined;
  const cleanedEndAt = endAt ? parseInt(escapeSql(endAt.toString()), 10) : undefined;
  const cleanedCursor = cursor ? escapeSql(cursor) : undefined;
  const cleanedResume = resume ? (resume as unknown === "true" || !!+resume) : false;
  return {
    translation: cleanedTranslation as Translation,
    pageSize: cleanedPageSize,
    startFrom: cleanedStartFrom,
    endAt: cleanedEndAt,
    cursor: cleanedCursor,
    resume: cleanedResume,
  };
}

// KV helpers

/**
 * Return the last part of a `Deno.KvKey` as a number.
 *
 * *Will return `NaN` if the key is not a number.*
 */
export const getIdFromKvEntry = <T>(entry: Deno.KvEntry<T>): number => {
  const id = entry.key[entry.key.length - 1];
  return parseInt(id.toString(), 10);
};

/**
 * Finds the last entry from a list of entries and
 * returns the last part of its `Deno.KvKey` as a number.
 *
 * *Will return `NaN` if the key is not a number.*
 */
export const getLastIdFromKvList = <T>(entries: Deno.KvEntry<T>[]): number => {
  const lastEntry = entries[entries.length - 1];
  return getIdFromKvEntry(lastEntry);
};

/**
 * Finds the minimum and maximum keys from a list of entries and
 * returns the last part of each `Deno.KvKey` as a number.
 *
 * *Will return `NaN` if the keys are not numbers.*
 */
export const getMinMaxIdsFromKvList = <T>(entries: Deno.KvEntry<T>[]): [min: number, max: number] => {
  const sorted = entries.toSorted((a, b) => getIdFromKvEntry(a) - getIdFromKvEntry(b));
  const lowestEntry = sorted[0];
  const highestEntry = sorted[sorted.length - 1];
  return [getIdFromKvEntry(lowestEntry), getIdFromKvEntry(highestEntry)];
};

export function cleanId(id: number): VerseId | undefined {
  const cleaned = parseInt(escapeSql(id.toString()), 10);
  return isValidId(cleaned) ? cleaned : undefined;
}

// General helpers

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function memoizeWithLimitedHistory<T extends any[], U>(fn: (...args: T) => U, limit = 1) {
  const cache: Record<string, any> = {};
  const keys: string[] = [];

  return (...args: T): U => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];
    } else {
      const result = fn(...args);
      cache[key] = result;
      keys.push(key);

      while (keys.length > limit) {
        delete cache[keys.shift()!];
      }

      return result;
    }
  };
}

export function memoizeWithLocalStorage<T extends any[], U>(fn: (...args: T) => U) {
  return (...args: T): U => {
    const key = JSON.stringify(args);
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key) || "");
    } else {
      const result = fn(...args);
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    }
  };
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = undefined;
    }, delay);
  };
}

export function createPartialFeedUrls(currentUrl: URL, data: ApiParams): { url: URL; fp: URL } {
  const url = setApiParamsInUrl(currentUrl, data);
  url.pathname = "/bible";
  const fp = new URL(url);
  fp.pathname = "/partials/feed";
  return { url, fp };
}

export function setParamsWithoutReload(params: Partial<ApiParams>, url: URL | string) {
  const newUrl = new URL(url);
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      newUrl.searchParams.delete(key);
    } else {
      newUrl.searchParams.set(
        key,
        (key === SQ_KEYS.START_FROM || key === SQ_KEYS.END_AT) ? value.toString().padStart(8, "0") : value?.toString(),
      );
    }
  }
  window.history.pushState(null, "", newUrl.toString());
  return newUrl;
}

export function getBoolFromLocalStorage(key: LS_KEYS, defaultValue = false): boolean {
  return !!JSON.parse(localStorage.getItem(key) || `${defaultValue}`);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function deleteInessentialsFromUrl(url: URL | string): URL {
  const newUrl = new URL(url);
  newUrl.searchParams.delete(SQ_KEYS.START_FROM);
  newUrl.searchParams.delete(SQ_KEYS.END_AT);
  newUrl.searchParams.delete(SQ_KEYS.CURSOR);
  newUrl.searchParams.delete(SQ_KEYS.INDEX);
  newUrl.searchParams.delete(SQ_KEYS.CURRENT);
  newUrl.searchParams.delete(SQ_KEYS.RESUME);
  return newUrl;
}
