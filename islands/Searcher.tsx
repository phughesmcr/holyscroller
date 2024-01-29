import { IS_BROWSER } from "$fresh/runtime.ts";
import { getNoOfChapters, getNoOfVerses, listOfBooks } from "@data";
import { LINK_CANONICAL, SQ_KEYS } from "@lib/constants.ts";
import { $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl, getIdFromString } from "@lib/utils.ts";
import IconSearch from "icons/search.tsx";
import { type JSX } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

export default function Searcher() {
  if (!IS_BROWSER) return <></>;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bookSelect = useRef<HTMLSelectElement>(null);
  const chapterSelect = useRef<HTMLSelectElement>(null);
  const verseSelect = useRef<HTMLSelectElement>(null);

  const showModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleSearch = () => {
    const id = getIdFromString(inputRef.current?.value ?? "");
    if (id === -1 || !id) {
      alert("Not found!");
      return;
    }
    closeModal();
    const newUrl = deleteInessentialsFromUrl($currentUrl.peek() ?? location?.href ?? LINK_CANONICAL);
    newUrl.searchParams.set(SQ_KEYS.START_FROM, id.toString());
    location.href = newUrl.toString();
  };

  const handleGoTo = () => {
    const book = bookSelect.current?.value;
    const chapter = chapterSelect.current?.value;
    const verse = verseSelect.current?.value;
    if (!book || !chapter || !verse) {
      alert("Please select all the fields!");
      return;
    }
    const id = getIdFromString(
      `${(Number(book) + 1).toString().padStart(2, "0")}${(Number(chapter) + 1).toString().padStart(3, "0")}${
        (Number(verse) + 1).toString().padStart(3, "0")
      }`,
    );
    if (id === -1 || !id) {
      alert("Not found!");
      return;
    }
    closeModal();
    const newUrl = deleteInessentialsFromUrl($currentUrl.peek() ?? location?.href ?? LINK_CANONICAL);
    newUrl.searchParams.set(SQ_KEYS.START_FROM, id.toString());
    location.href = newUrl.toString();
  };

  const handleBookChange = useCallback((e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const book = e.currentTarget.value;
    const chapters = getNoOfChapters(Number(book));
    const chaptersOptions: Node[] = Array.from({ length: chapters }, (_, i) => {
      const option = document.createElement("option");
      option.value = i.toString();
      option.textContent = (i + 1).toString();
      return option;
    });
    chapterSelect.current?.replaceChildren(...chaptersOptions);
  }, []);

  const handleChapterChange = useCallback((e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const book = bookSelect.current?.value ?? 0;
    const verses = getNoOfVerses(Number(book) + 1, Number(e.currentTarget.value));
    console.log(verses, Number(book) + 1, Number(e.currentTarget.value));
    const versesOptions = Array.from({ length: verses }, (_, i) => {
      const option = document.createElement("option");
      option.value = i.toString();
      option.textContent = (i + 1).toString();
      return option;
    });
    verseSelect.current?.replaceChildren(...versesOptions);
  }, []);

  useEffect(() => {
    handleBookChange({ currentTarget: { value: 1 } } as unknown as JSX.TargetedEvent<HTMLSelectElement, Event>);
    setTimeout(
      () =>
        handleChapterChange({ currentTarget: { value: 1 } } as unknown as JSX.TargetedEvent<HTMLSelectElement, Event>),
      250,
    );
  }, []);

  return (
    <>
      <div id="searcher" className="absolute right-2 z-20 cursor-pointer">
        <button type="button" ref={buttonRef} onClick={showModal} className="bg-transparent">
          <IconSearch className="w-8 h-8" />
          <span className="sr-only">Search for Verse</span>
        </button>
      </div>

      <dialog ref={dialogRef} className="modal max-w-[85%] p-4 rounded bg-zinc-100">
        <form method="dialog" className="flex flex-col gap-2 items-center justify-center">
          <label htmlFor="search">Search for Verse</label>
          <small>
            E.g. <q>Ruth 1:16</q> or <q>43003016</q>
          </small>
          <input type="search" id="search" className="w-full" ref={inputRef} onSearch={handleSearch} />
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={handleSearch}
          >
            Search
          </button>
        </form>

        <form method="dialog" className="flex flex-col gap-2 items-center justify-center my-2">
          <label>Go To Verse</label>
          <div className="flex gap-2">
            <select
              name="bookGoto"
              aria-label="Book"
              title="Book"
              className="w-6/12 cursor-pointer"
              ref={bookSelect}
              onChange={handleBookChange}
            >
              {Array.from({ length: 66 }, (_, i) => (
                <option key={i} value={i}>
                  {listOfBooks[i][1]}
                </option>
              ))}
            </select>
            <select
              name="chapterGoto"
              aria-label="Chapter"
              title="Chapter"
              className="w-3/12 cursor-pointer"
              ref={chapterSelect}
              onChange={handleChapterChange}
            >
            </select>
            <select
              name="verseGoto"
              aria-label="Verse"
              title="Verse"
              className="w-3/12 cursor-pointer"
              ref={verseSelect}
            >
            </select>
          </div>
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={handleGoTo}
          >
            Go
          </button>
        </form>

        <button
          type="reset"
          className="w-full bg-gray-400 hover:bg-gray-500 text-black py-2 px-4 rounded-full cursor-pointer"
          onClick={closeModal}
        >
          Cancel
        </button>
      </dialog>
    </>
  );
}
