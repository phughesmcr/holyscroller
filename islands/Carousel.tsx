import { IS_BROWSER } from "$fresh/runtime.ts";
import { getPericopeFromIdMemoized } from "@data";
import { API_DEFAULT_PAGE_SIZE, API_DEFAULT_TRANSLATION, DATASET_VID, LS_KEYS, SQ_KEYS } from "@lib/constants.ts";
import { $currentParams, $currentUrl, $currentVerse, $isLoading } from "@lib/state.ts";
import type { ApiParams, ApiResponse, VerseId } from "@lib/types.ts";
import { debounce, getLastNElements, getRefFromId, isValidId, setOrRemoveFromStorage } from "@lib/utils.ts";
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

  const hasTriggered = useSignal<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nextAnchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    $isLoading.value = false;
  }, []);

  //#region currentParams.value update

  const updateLSFromParams = useCallback((params: ApiParams) => {
    const { translation, startFrom, endAt, cursor, pageSize } = params;
    localStorage?.setItem(LS_KEYS.TRANSLATION, translation);
    localStorage?.setItem(LS_KEYS.PAGE_SIZE, pageSize.toString());
    setOrRemoveFromStorage(LS_KEYS.START_FROM, startFrom?.toString());
    setOrRemoveFromStorage(LS_KEYS.END_AT, endAt?.toString());
    setOrRemoveFromStorage(LS_KEYS.CURSOR, cursor?.toString());
  }, []);

  effect(() => {
    const params = $currentParams.value;
    if (!params) return;
    updateLSFromParams(params);
  });

  //#endregion

  //#region currentVerse.value update

  const updateLSFromVerse = useCallback((id: VerseId) => {
    setOrRemoveFromStorage(LS_KEYS.START_FROM, id.toString());
  }, []);

  effect(() => {
    const startFrom = $currentVerse.value;
    if (!startFrom || !IS_BROWSER) return;
    updateLSFromVerse(startFrom);
  });

  //#endregion

  //#region scroll observer

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

  const setParamsFromId = (id: string) => {
    const vid = parseInt(id, 10) as VerseId;
    if (!isValidId(vid)) return;
    $currentVerse.value = vid;
    setParams(vid);
  };

  const triggerLoad = () => {
    hasTriggered.value = true;
    nextAnchorRef.current?.click();
  };

  const scrollHandler = debounce((triggerPoints: Element[], entry: IntersectionObserverEntry) => {
    if (!entry.target || !entry.isIntersecting) return;
    const target = entry.target as HTMLDivElement;
    const id = target.dataset[DATASET_VID];
    if (id) {
      setParamsFromId(id);
    }
    if (triggerPoints.includes(target) && !hasTriggered.value) {
      triggerLoad();
    }
  }, DEBOUNCE_TIMER_MS);

  const handleScrollIntoView = useCallback((entry: IntersectionObserverEntry) => {
    const nTriggerPoints = Math.ceil(($currentParams.peek()?.pageSize || API_DEFAULT_PAGE_SIZE) / 2);
    const triggerPoints = getLastNElements("article", nTriggerPoints).filter(Boolean).reverse();
    scrollHandler(triggerPoints, entry);
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

  //#endregion

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
        <a className="hidden" ref={nextAnchorRef} href={next.url.toString()} f-partial={next.fp.toString()}>
          <span className="sr-only">Load More</span>
        </a>
      )}
    </>
  );
}
