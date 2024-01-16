import { IS_BROWSER } from "$fresh/runtime.ts";
import { getPericopeFromIdMemoized } from "@data";
import {
  API_DEFAULT_PAGE_SIZE,
  API_DEFAULT_TRANSLATION,
  DATASET_TRIGGER,
  DATASET_VID,
  SQ_KEYS,
} from "@lib/constants.ts";
import { $currentUrl, $currentVerse, $isLoading } from "@lib/state.ts";
import type { ApiResponse, VerseId } from "@lib/types.ts";
import { debounce, generateId, getRefFromId } from "@lib/utils.ts";
import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import Article from "../components/Article.tsx";

type CarouselProps = {
  res: ApiResponse;
};

export default function Carousel({ res }: CarouselProps) {
  if (!IS_BROWSER) return <></>;

  const { verses = [], pageSize = API_DEFAULT_PAGE_SIZE, translation = API_DEFAULT_TRANSLATION, next, extras } = res;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    current.scrollTo({ top: 0 });
    // current.focus();
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
          const trigger = (target as HTMLDivElement).dataset[DATASET_TRIGGER];
          if (trigger) {
            const anchor = target.querySelector("a");
            if (anchor) {
              firstArticle.value?.classList.add("opacity-0");
              setTimeout(() => {
                anchor.click();
              }, 250);
            }
          }
        }
      }
    }, 200);
    debounced();
  }, []);

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
