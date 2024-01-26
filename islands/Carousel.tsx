import { IS_BROWSER } from "$fresh/runtime.ts";
import { getPericopeFromIdMemoized } from "@data";
import { API_DEFAULT_PAGE_SIZE, API_DEFAULT_TRANSLATION, DATASET_VID, LS_KEYS, SQ_KEYS } from "@lib/constants.ts";
import { $currentParams, $currentUrl, $currentVerse, $isLoading } from "@lib/state.ts";
import type { ApiParams, ApiResponse, VerseId } from "@lib/types.ts";
import { debounce, getRefFromId, setOrRemoveFromStorage } from "@lib/utils.ts";
import { effect, useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import Article from "../components/Article.tsx";

type CarouselProps = {
  res: ApiResponse;
};

const DEBOUNCE_TIMER_MS = 200 as const;
const SET_PARAMS_TIMER_MS = 300 as const;

export default function Carousel({ res }: CarouselProps) {
  if (!IS_BROWSER) return <></>;

  const {
    extras,
    next,
    pageSize = API_DEFAULT_PAGE_SIZE,
    resume = false,
    translation = API_DEFAULT_TRANSLATION,
    verses = [],
  } = res;

  const updateFromParams = useCallback((params: ApiParams) => {
    // set params in local storage
    const { translation, startFrom, endAt, cursor, pageSize } = params;
    localStorage?.setItem(LS_KEYS.TRANSLATION, translation);
    localStorage?.setItem(LS_KEYS.PAGE_SIZE, pageSize.toString());
    setOrRemoveFromStorage(LS_KEYS.START_FROM, startFrom?.toString());
    setOrRemoveFromStorage(LS_KEYS.END_AT, endAt?.toString());
    setOrRemoveFromStorage(LS_KEYS.CURSOR, cursor?.toString());
  }, []);

  effect(() => {
    const params = $currentParams.value;
    if (params === null || !IS_BROWSER) return;
    updateFromParams(params);
  });

  const updateFromVerse = useCallback((id: VerseId) => {
    setOrRemoveFromStorage(LS_KEYS.START_FROM, id.toString());
  }, []);

  effect(() => {
    const startFrom = $currentVerse.value;
    if (!startFrom || !IS_BROWSER) return;
    updateFromVerse(startFrom);
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const setParams = useCallback(
    debounce((id: number) => {
      const value = $currentUrl.peek();
      if (!value) return;
      const newUrl = new URL(value);
      newUrl.searchParams.set(SQ_KEYS.CURRENT, `${id}`);
      globalThis.history.pushState(null, "", newUrl.toString());
    }, SET_PARAMS_TIMER_MS),
    [],
  );

  useEffect(() => {
    $isLoading.value = false;
  }, []);

  // START: SCROLLING OBSERVER

  const hasTriggered = useSignal<boolean>(false);
  const nextAnchor = useRef<HTMLAnchorElement>(null);

  const handleScrollIntoView = useCallback((entry: IntersectionObserverEntry) => {
    const triggerPoints = [3, 2, 1]
      .map((i) => document.querySelector(`article:nth-last-of-type(${i})`))
      .filter(Boolean);

    const debounced = debounce(() => {
      if (entry.isIntersecting) {
        const { target } = entry;
        if (!target) return;
        const id = (target as HTMLDivElement).dataset[DATASET_VID];
        if (id) {
          const vid = parseInt(id, 10) as VerseId;
          $currentVerse.value = vid;
          setParams(vid);
        }
        if (triggerPoints.includes(target) && !hasTriggered.value) {
          hasTriggered.value = true;
          nextAnchor.current?.click();
        }
      }
    }, DEBOUNCE_TIMER_MS);

    debounced();
  }, [observerRef.current]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => handleScrollIntoView(entry));
    }, { threshold: 1 });

    const articles = document.querySelectorAll("article");
    articles.forEach((article) => {
      observerRef.current?.observe(article);
    });

    return () => {
      if (observerRef.current) {
        articles.forEach((article) => observerRef.current?.unobserve(article));
        observerRef.current = null;
      }
    };
  }, [handleScrollIntoView]);

  // END: SCROLLING OBSERVER

  return (
    <>
      {verses?.map((verse) => {
        const id = verse[0] as VerseId;
        const book = getRefFromId(id)[0];
        const peri = getPericopeFromIdMemoized(id);
        return (
          <Article
            /* TODO: this needs fixing!
            aria-posinset={}
            aria-setsize={} */
            bookInfo={extras.books[book]}
            key={id}
            pericope={peri?.t}
            translation={translation}
            verse={verse}
          />
        );
      })}
      {next && (
        <a className="hidden" ref={nextAnchor} href={next.url.toString()} f-partial={next.fp.toString()}>
          <span className="sr-only">Load More</span>
        </a>
      )}
    </>
  );
}
