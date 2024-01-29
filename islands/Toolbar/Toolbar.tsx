import { IS_BROWSER } from "$fresh/runtime.ts";
import TranslationSelect from "./TranslationSelect.tsx";

export default function Toolbar() {
  if (!IS_BROWSER) return <></>;
  return (
    <div
      role="toolbar"
      aria-label="Contents"
      aria-orientation="horizontal"
      className="fixed top-0 left-0 z-20 w-full max-w-lvw h-13 p-4 flex flex-row justify-start items-center flex-nowrap gap-1 bg-transparent text-zinc-400"
    >
      <TranslationSelect />
      {
        /* <BookSelect />
      <PericopeSelect /> */
      }
    </div>
  );
}
