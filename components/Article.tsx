import type { BookInfo, Verse, VerseId } from "@lib/types.ts";
import { getRefFromId } from "@lib/utils.ts";
import type { JSX } from "preact";

type ArticleProps = {
  translation: string;
  idx: number;
  verse: Verse;
  key: number;
  bookInfo?: BookInfo;
  crossRefs?: Deno.KvEntry<string>[];
  pericope?: string;
} & JSX.HTMLAttributes<HTMLElement>;

export default function Article(props: ArticleProps) {
  const { idx, key, translation, verse, bookInfo, crossRefs, pericope = "" } = props;
  const [id, text] = verse;

  const [b, c, v] = getRefFromId(id as VerseId);

  if (!bookInfo) {
    return (
      <article
        {...props}
        key={key}
        tabIndex={0}
        className="ui w-full h-full snap-start snap-always"
      >
        <h1>Error: No bookInfo for {id}</h1>
      </article>
    );
  }

  return (
    <article
      {...props}
      key={key}
      data-verse={id}
      tabIndex={0}
      className="ui w-full h-full snap-start snap-always transition-opacity"
    >
      <div className="info shadow-sm w-full" tabIndex={0}>
        <h1 title="Book Title" aria-label="Book Title">{v === 1 ? bookInfo.title_full : bookInfo.title_short}</h1>
        <h2 title="Book reference" aria-label="Book reference">Chapter {c} - Verse {v}</h2>
        <h3 title="Pericope title" aria-label="Pericope title">{pericope}</h3>
        <p>
          #<span title={bookInfo.otnt === "OT" ? "Old Testament" : "New Testament"}>{bookInfo.otnt}</span>{" "}
          #<span title={"Genre"}>{bookInfo.category.replace(/\s+/, "")}</span>{" "}
          #<span title={"Translation"}>{translation.toUpperCase()}</span> #<span title={"Verse ID"}>{id}</span>
        </p>
      </div>
      <p>{text}</p>

      {
        /* <div className="absolute right-0 bottom-24 cursor-pointer">
        <button
          type="button"
          class="px-3 py-2 bg-transparent text-white"
          title="Cross References"
          aria-label="Find cross references for this verse"
        >
          <IconAffiliate class="w-14 h-14" />
        </button>
      </div>

      <section className="absolute top-0 left-0 hidden">
        {crossRefs?.map((ref) => {
          const { value } = ref;
          const id = getIdFromKvEntry(ref);
          const [b, c, v] = refFromId(id);
          const title = getBookInfoById(b)?.title_short;
          return (
            <div>
              <p>{value}</p>
              <small>{title} {c}:{v}</small>
            </div>
          );
        })}
      </section> */
      }
    </article>
  );
}
