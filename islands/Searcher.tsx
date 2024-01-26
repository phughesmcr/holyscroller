import { IS_BROWSER } from "$fresh/runtime.ts";
import IconSearch from "icons/search.tsx";
import { useRef } from "preact/hooks";

export default function Searcher() {
  if (!IS_BROWSER) return <></>;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleSearch = () => {
    closeModal();
  };

  return (
    <>
      <div id="searcher" className="absolute right-2 z-20 cursor-pointer">
        <button type="button" ref={buttonRef} onClick={showModal} className="bg-transparent">
          <IconSearch className="w-8 h-8" />
          <span className="sr-only">Search for Verse</span>
        </button>
      </div>

      <dialog ref={dialogRef} className="modal max-w-[65%] p-2 rounded">
        <form method="dialog" className="flex flex-col gap-2 items-center justify-center">
          <label htmlFor="search">Search for Verse</label>
          <small>
            E.g. <q>Ruth 1:16</q> or <q>43003016</q>
          </small>
          <input type="search" id="search" onSearch={handleSearch} />
          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={handleSearch}
          >
            Search
          </button>
          <button
            type="reset"
            className="w-full bg-red-400 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-full cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>
        </form>
      </dialog>
    </>
  );
}
