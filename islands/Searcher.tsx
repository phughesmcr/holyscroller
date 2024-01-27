import { IS_BROWSER } from "$fresh/runtime.ts";
import { LINK_CANONICAL, SQ_KEYS } from "@lib/constants.ts";
import { deleteInessentialsFromUrl, getIdFromString } from "@lib/utils.ts";
import IconSearch from "icons/search.tsx";
import { useRef } from "preact/hooks";
import { $currentUrl } from "@lib/state.ts";

export default function Searcher() {
  if (!IS_BROWSER) return <></>;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <div id="searcher" className="absolute right-2 z-20 cursor-pointer">
        <button type="button" ref={buttonRef} onClick={showModal} className="bg-transparent">
          <IconSearch className="w-8 h-8" />
          <span className="sr-only">Search for Verse</span>
        </button>
      </div>

      <dialog ref={dialogRef} className="modal max-w-[65%] p-4 rounded bg-zinc-100">
        <form method="dialog" className="flex flex-col gap-2 items-center justify-center">
          <label htmlFor="search">Search for Verse</label>
          <small>
            E.g. <q>Ruth 1:16</q> or <q>43003016</q>
          </small>
          <input type="search" id="search" ref={inputRef} onSearch={handleSearch} />
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="reset"
            className="w-full bg-red-400 hover:bg-red-500 text-black font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
}
