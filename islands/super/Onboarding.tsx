import { IS_BROWSER } from "$fresh/runtime.ts";
import { LS_KEYS } from "@lib/constants.ts";
import { $isOnboard } from "@lib/state.ts";
import { getBoolFromLocalStorage } from "@lib/utils.ts";
import { effect } from "@preact/signals";
import IconArrowBigUpLinesFilled from "icons/arrow-big-up-lines-filled.tsx";
import { useCallback, useEffect, useRef } from "preact/hooks";

export default function Onboarding() {
  if (!IS_BROWSER) return <></>;

  const dialogRef = useRef<HTMLDivElement>(null);

  effect(() => {
    if ($isOnboard.value) {
      dialogRef.current?.remove();
    }
  });

  const toggleIsOnboard = useCallback(() => {
    $isOnboard.value = true;
    localStorage?.setItem(LS_KEYS.ONBOARD, "true");
  }, []);

  useEffect(() => {
    dialogRef.current?.focus();
    $isOnboard.value = getBoolFromLocalStorage(LS_KEYS.ONBOARD) || false;
  }, []);

  return (
    <div
      tabIndex={-1}
      ref={dialogRef}
      hidden={$isOnboard}
      aria-hidden={$isOnboard}
      role="dialog"
      aria-label="Scroll up to get started!"
      aria-description="Interact to dismiss this screen and get started."
      className="pointer-events-auto z-50 flex isolate absolute top-0 left-0 flex-col items-center justify-center w-full h-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-100 opacity-80 touch-manipulation"
      onTouchStart={toggleIsOnboard}
      onPointerDown={toggleIsOnboard}
      onMouseDown={toggleIsOnboard}
    >
      <button
        type="button"
        aria-label="Close this dialog"
        className="absolute top-12 right-0 text-3xl m-4"
        onClick={toggleIsOnboard}
      >
        <span className="not-sr-only">&times;</span>
        <span className="sr-only">Close</span>
      </button>

      <IconArrowBigUpLinesFilled className="w-28 h-28 animate-bounce" />
      <p className="font-bold text-5xl">Scroll Up</p>
    </div>
  );
}
