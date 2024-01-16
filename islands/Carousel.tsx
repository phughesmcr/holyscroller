import { IS_BROWSER } from "$fresh/runtime.ts";
import { getPericopeFromIdMemoized } from "@data";
import { API_DEFAULT_PAGE_SIZE, API_DEFAULT_TRANSLATION, DATASET_VID, LS_KEYS, SQ_KEYS } from "@lib/constants.ts";
import { $currentParams, $currentUrl, $currentVerse, $isLoading } from "@lib/state.ts";
import type { ApiParams, ApiResponse, VerseId } from "@lib/types.ts";
import { debounce, deleteInessentialsFromUrl, generateId, getRefFromId } from "@lib/utils.ts";
import { effect, useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import Article from "../components/Article.tsx";

type CarouselProps = {
  res: ApiResponse;
};

export default function Carousel({ res }: CarouselProps) {
  if (!IS_BROWSER) return <></>;

  const { verses = [], pageSize = API_DEFAULT_PAGE_SIZE, translation = API_DEFAULT_TRANSLATION, next, extras, resume } =
    res;

  if (resume) {
    const url = deleteInessentialsFromUrl(res.origin);
    const translation = localStorage?.getItem(LS_KEYS.TRANSLATION);
    const startFrom = localStorage?.getItem(LS_KEYS.START_FROM);
    const endAt = localStorage?.getItem(LS_KEYS.END_AT);
    const cursor = localStorage?.getItem(LS_KEYS.CURSOR);
    const pageSize = localStorage?.getItem(LS_KEYS.PAGE_SIZE);
    if (translation) url.searchParams.set(SQ_KEYS.TRANSLATION, translation);
    if (startFrom) url.searchParams.set(SQ_KEYS.START_FROM, startFrom);
    if (endAt) url.searchParams.set(SQ_KEYS.END_AT, endAt);
    if (cursor) url.searchParams.set(SQ_KEYS.CURSOR, cursor);
    if (pageSize) url.searchParams.set(SQ_KEYS.PAGE_SIZE, pageSize);
    if (location) location.href = url.toString();
  }

  const updateFromParams = useCallback((params: ApiParams) => {
    // set params in local storage
    const { translation, startFrom, endAt, cursor, pageSize } = params;
    localStorage.setItem(LS_KEYS.TRANSLATION, translation);
    localStorage.setItem(LS_KEYS.PAGE_SIZE, pageSize.toString());
    if (startFrom) {
      localStorage.setItem(LS_KEYS.START_FROM, startFrom.toString());
    } else {
      localStorage.removeItem(LS_KEYS.START_FROM);
    }
    if (endAt) {
      localStorage.setItem(LS_KEYS.END_AT, endAt.toString());
    } else {
      localStorage.removeItem(LS_KEYS.END_AT);
    }
    if (cursor) {
      localStorage.setItem(LS_KEYS.CURSOR, cursor);
    } else {
      localStorage.removeItem(LS_KEYS.CURSOR);
    }
  }, []);

  effect(() => {
    const params = $currentParams.value;
    if (params === null || !IS_BROWSER) return;
    updateFromParams(params);
  });

  const updateFromVerse = useCallback((id: VerseId) => {
    if (id) {
      localStorage?.setItem(LS_KEYS.START_FROM, id.toString());
    } else {
      localStorage.removeItem(LS_KEYS.START_FROM);
    }
  }, []);

  effect(() => {
    const startFrom = $currentVerse.value;
    if (!startFrom || !IS_BROWSER) return;
    updateFromVerse(startFrom);
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    current.scrollTo({ top: 0 });
    // current.focus(); // TODO: what is accessibility best practice here?
    containerRef.current?.setAttribute("aria-busy", "false");
  }, [containerRef]);

  const setParams = useCallback(
    debounce((id: number) => {
      const value = $currentUrl.peek();
      if (value) {
        const newUrl = new URL(value);
        newUrl.searchParams.set(SQ_KEYS.CURRENT, `${id}`);
        window.history.pushState(null, "", newUrl.toString());
      }
    }, 300),
    [],
  );

  useEffect(() => {
    $isLoading.value = false;
  }, []);

  // START: SCROLLING OBSERVER

  const firstArticle = useSignal<HTMLDivElement | null>(null);
  const loadMoreAnchor = useRef<HTMLAnchorElement | null>(null);

  const handleScrollIntoView = useCallback((entry: IntersectionObserverEntry) => {
    const debounced = debounce(() => {
      if (entry.isIntersecting) {
        const { target } = entry;
        if (!target) return;
        const id = (target as HTMLDivElement).dataset[DATASET_VID];
        if (id) {
          const vid = parseInt(id, 10) as VerseId;
          $currentVerse.value = vid;
          setParams(vid);
        } else {
          if (loadMoreAnchor.current) {
            // Fade out top article to avoid jarring transition
            firstArticle.value?.classList.add("opacity-0");
            containerRef.current?.setAttribute("aria-busy", "true");
            setTimeout(() => {
              loadMoreAnchor.current?.click();
            }, 250);
          }
        }
      }
    }, 200);
    debounced();
  }, [firstArticle, observerRef.current]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => handleScrollIntoView(entry));
    }, { threshold: 1 });

    const articles = document.querySelectorAll("article");
    articles.forEach((article, i) => {
      if (i === 0) firstArticle.value = article as HTMLDivElement;
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
    <div
      ref={containerRef}
      role="feed"
      aria-busy="false"
      className="w-full h-full overflow-x-hidden overflow-y-auto hide-scrollbars touch-pan-y snap-y snap-mandatory p-2 overscroll-touch"
    >
      {verses?.map((verse, index) => {
        const id = verse[0] as VerseId;
        const book = getRefFromId(id)[0];
        const peri = getPericopeFromIdMemoized(id);
        return (
          <Article
            aria-posinset={index + 1}
            aria-setsize={((pageSize || -1) + 1) || -1} // (pageSize + 1) or -1
            idx={index}
            translation={translation}
            key={id}
            verse={verse}
            bookInfo={extras?.books[book]}
            // crossRefs={extras?.crossRefs[verse[0]]}
            pericope={peri?.t}
          />
        );
      })}
      {next && (
        <article
          aria-posinset={(pageSize || verses.length) + 1}
          aria-setsize={((pageSize || -1) + 1) || -1} // pageSize or -1
          key={generateId()}
          data-trigger="load-more"
          className="w-full h-full snap-start snap-always mb-4"
        >
          <a
            ref={loadMoreAnchor}
            href={next.url.toString()}
            f-partial={next.fp.toString()}
            className="w-full h-full flex items-center justify-center"
            onClick={scrollToTop}
            aria-label="Load more"
          >
            <span className="text-2xl dark:text-cyan-300 text-cyan-900 underline">Loading more...</span>
          </a>
        </article>
      )}
    </div>
  );
}
