import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { getBookIdFromTitleMemoized, listOfBooks } from "@data";
import { LINK_CANONICAL } from "@lib/constants.ts";
import { $currentRef, $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { batch, effect, useSignal } from "@preact/signals";
import { escapeSql } from "escape";
import type { JSX } from "preact";
import { useRef } from "preact/hooks";

export default function BookSelect() {
  if (!IS_BROWSER) return <></>;

  const selectedBook = useSignal(-1);
  const selectedBookTitle = useSignal("");
  const selectRef = useRef<HTMLSelectElement>(null);

  effect(() => {
    const ref = $currentRef.value;
    batch(() => {
      selectedBook.value = ref[0];
      selectedBookTitle.value = listOfBooks[ref[0] - 1][1];
    });
  });

  const changeBook = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const selection = escapeSql(e.currentTarget.value);
    selectedBook.value = getBookIdFromTitleMemoized(selection) ?? 1;
    const res = deleteInessentialsFromUrl(new URL($currentUrl.peek() ?? location.href ?? LINK_CANONICAL));
    res.pathname = `/bible/${selection}`;
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-4/12 min-w-[4ch]">
      <Label htmlFor="book-select">
        Book
        <Select
          ref={selectRef}
          title="Book"
          aria-label="Select a book of the Bible"
          name="book-select"
          id="book-select"
          onChange={changeBook}
          value={selectedBookTitle.value}
        >
          {listOfBooks.map(([apiKey, title], index) => (
            <option
              key={index}
              title={title}
              aria-label={title}
              selected={index + 1 === selectedBook.value}
              value={apiKey}
              className="truncate"
            >
              {title}
            </option>
          ))}
        </Select>
      </Label>
    </div>
  );
}
