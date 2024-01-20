import type { BookInfo, Verse, VerseId } from "@lib/types.ts";
import { getRefFromId } from "@lib/utils.ts";
import type { JSX } from "preact";

type ArticleProps = {
  bookInfo: BookInfo;
  pericope?: string;
  translation: string;
  verse: Verse;
} & JSX.HTMLAttributes<HTMLElement>;

export default function Article(props: ArticleProps) {
  const { translation, verse, bookInfo, pericope } = props;
  const [id, text] = verse;

  const [_b, c, v] = getRefFromId(id as VerseId);

  return (
    <article
      {...props}
      data-verse={id}
      tabIndex={0}
      className="ui w-full h-full snap-start snap-always"
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
    </article>
  );
}
