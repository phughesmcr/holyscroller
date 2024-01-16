import { $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { effect } from "@preact/signals";
import IconBible from "icons/bible.tsx";
import IconMessageChatbot from "icons/message-chatbot.tsx";
import IconMusicHeart from "icons/music-heart.tsx";
import IconZoomQuestion from "icons/zoom-question.tsx";
import { useRef } from "preact/hooks";
import NavButton from "../components/NavButton.tsx";

export default function NavBar() {
  const bibleRef = useRef<HTMLAnchorElement>(null);
  const psalmsRef = useRef<HTMLAnchorElement>(null);
  const proverbsRef = useRef<HTMLAnchorElement>(null);
  const catechismRef = useRef<HTMLAnchorElement>(null);

  effect(() => {
    const value = $currentUrl.value;
    if (!value) return;
    const bibleUrl = new URL(value);
    bibleUrl.pathname = "/bible";

    const psalmsUrl = deleteInessentialsFromUrl(bibleUrl);
    const proverbsUrl = new URL(psalmsUrl);
    const catechismUrl = new URL(psalmsUrl);

    psalmsUrl.pathname = "/bible/psalms";
    proverbsUrl.pathname = "/bible/proverbs";
    catechismUrl.pathname = "/catechism";

    if (bibleRef.current) bibleRef.current.href = bibleUrl.toString();
    if (psalmsRef.current) psalmsRef.current.href = psalmsUrl.toString();
    if (proverbsRef.current) proverbsRef.current.href = proverbsUrl.toString();
    if (catechismRef.current) catechismRef.current.href = catechismUrl.toString();
  });

  return (
    <div className="min-w-0 min-h-0 w-full h-full">
      <nav
        role="navigation"
        aria-label="Quick links"
        aria-orientation="horizontal"
        className="flex flex-row justify-around items-center p-1 gap-1 touch-none overflow-hidden h-full w-full max-w-full max-h-full bg-zinc-700 dark:bg-zinc-900 text-zinc-100"
      >
        <NavButton
          ref={bibleRef}
          href="/bible"
          innerText="Bible"
          f-client-nav={false}
        >
          <IconBible className="w-5 h-5" />
        </NavButton>

        <NavButton
          ref={psalmsRef}
          href="/bible/psalms"
          innerText="Psalms"
          f-client-nav={false}
        >
          <IconMusicHeart className="w-5 h-5" />
        </NavButton>

        <NavButton
          ref={proverbsRef}
          href="/bible/proverbs"
          innerText="Proverbs"
          f-client-nav={false}
        >
          <IconMessageChatbot className="w-5 h-5" />
        </NavButton>

        <NavButton
          ref={catechismRef}
          href="/catechism"
          innerText="Catechism"
          f-client-nav={false}
        >
          <IconZoomQuestion className="w-5 h-5" />
        </NavButton>
      </nav>
    </div>
  );
}
