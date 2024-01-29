import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { listOfBooks } from "@data";
import { LINK_CANONICAL } from "@lib/constants.ts";
import { $currentRef, $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { effect, useSignal } from "@preact/signals";
import { escapeSql } from "escape";
import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

export default function BookSelect() {
  if (!IS_BROWSER) return <></>;

  const selectedBook = useSignal<string>("");
  const selectRef = useRef<HTMLSelectElement>(null);

  const updateSelection = (book: number) => {
    if (!selectRef.current) return;
    const title = listOfBooks[book - 1][0];
    selectedBook.value = title;
    selectRef.current.value = title;
  };

  effect(() => {
    const [book] = $currentRef.value;
    updateSelection(book);
  });

  useEffect(() => {
    const [book] = $currentRef.value;
    updateSelection(book);
  }, []);

  const changeBook = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const selection = escapeSql(e.currentTarget.value);
    const res = deleteInessentialsFromUrl(new URL($currentUrl.peek() ?? location.href ?? LINK_CANONICAL));
    res.pathname = `/bible/${selection}`;
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-4/12 min-w-[4ch]">
      <Label htmlFor="book-select">
        <span className="truncate">
          Book
        </span>
        <Select
          aria-label="Select a book of the Bible"
          id="book-select"
          name="book-select"
          onChange={changeBook}
          ref={selectRef}
          title="Book"
          value={selectedBook.value}
        >
          {listOfBooks.map(([apiKey, title], index) => (
            <option
              key={index}
              title={title}
              aria-label={title}
              selected={apiKey === selectedBook.value}
              value={apiKey}
            >
              {title}
            </option>
          ))}
        </Select>
      </Label>
    </div>
  );
}
