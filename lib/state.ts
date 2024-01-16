import { getPericopesForBook } from "@data";
import {
  API_DEFAULT_ID,
  API_DEFAULT_PAGE_SIZE,
  API_DEFAULT_TRANSLATION,
  API_MAX_ID,
  API_MAX_PAGE_SIZE,
  API_MIN_ID,
  API_MIN_PAGE_SIZE,
  FAB_URL,
} from "@lib/constants.ts";
import type { ApiParams, Pericope, Translation, VerseId } from "@lib/types.ts";
import { clamp, getApiParamsFromUrl, getRefFromId } from "@lib/utils.ts";
import { computed, signal } from "@preact/signals";

// URL based state

export const $currentUrl = signal<URL | null>(null);

export const $currentParams = computed<ApiParams | null>(() => {
  const value = $currentUrl.value;
  return value ? getApiParamsFromUrl(value) : null;
});

export const $currentTranslation = computed<Translation>(() =>
  $currentParams.value?.translation || API_DEFAULT_TRANSLATION
);

export const $currentPageSize = computed<number>(() => {
  return clamp($currentParams.value?.pageSize || API_DEFAULT_PAGE_SIZE, API_MIN_PAGE_SIZE, API_MAX_PAGE_SIZE);
});

export const $currentStartFrom = computed<VerseId | undefined>(() => {
  if (!$currentParams.value?.startFrom) return;
  return clamp(
    parseInt($currentParams.value.startFrom?.toString() || API_DEFAULT_ID.toString(), 10),
    API_MIN_ID,
    API_MAX_ID,
  ) as VerseId;
});

export const $currentEndAt = computed<VerseId | undefined>(() => {
  if (!$currentParams.value?.endAt) return;
  return clamp(
    parseInt($currentParams.value.endAt?.toString() || API_DEFAULT_ID.toString(), 10),
    API_MIN_ID,
    API_MAX_ID,
  ) as VerseId;
});

export const $currentCursor = computed<string | undefined>(() => $currentParams.value?.cursor);

// tracking current view

export const $currentVerse = signal<VerseId>(API_DEFAULT_ID as VerseId);

export const $currentRef = computed(() => getRefFromId($currentVerse.value as VerseId));

export const $currentPericopes = computed<Pericope[]>(() => {
  const [book] = $currentRef.value;
  return getPericopesForBook(book);
});

export const $currentPericope = computed(() => {
  const list = $currentPericopes.value;
  if (!list.length) return undefined;
  const verse = $currentVerse.value;
  return list.find(({ r }) => r[0] <= verse && verse <= r[1]);
});

export const $currentPericopeIndex = computed(() => {
  if (!$currentPericope.value) return -1;
  const list = $currentPericopes.value;
  if (!list.length) return -1;
  return list.findIndex((p) => p === $currentPericope.value);
});

// FAB
export const $showFab = signal<boolean>(true);
export const $fabUrl = signal<URL>(new URL(FAB_URL));

// internal signals

export const $isLoading = signal<boolean>(true);
export const $isOnboard = signal<boolean>(false);
