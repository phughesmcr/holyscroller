import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { LINK_CANONICAL, SQ_KEYS, TRANSLATIONS } from "@lib/constants.ts";
import { $currentTranslation, $currentUrl } from "@lib/state.ts";
import { generateId } from "@lib/utils.ts";
import { effect } from "@preact/signals";
import type { JSX } from "preact";
import { useRef } from "preact/hooks";

export default function TranslationSelect() {
  if (!IS_BROWSER) return <></>;

  const selectRef = useRef<HTMLSelectElement>(null);

  effect(() => {
    const value = $currentTranslation.value;
    if (!value || !selectRef.current) return;
    selectRef.current.value = value;
  });

  const changeTranslation = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const res = new URL($currentUrl.peek() ?? location?.href ?? LINK_CANONICAL);
    res.searchParams.set(SQ_KEYS.TRANSLATION, e.currentTarget.value);
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-3/12 min-w-[5ch]">
      <Label htmlFor="translation-select">
        <span className="truncate">
          Trans.
        </span>
        <Select
          ref={selectRef}
          title="Bible Translation"
          aria-label="Choose a bible translation"
          name="translation-select"
          id="translation-select"
          onChange={changeTranslation}
          value={$currentTranslation.value}
          key={generateId()}
        >
          {TRANSLATIONS.map((trans) => {
            const { flag, innerText, title, value } = trans;
            return (
              <option
                key={value}
                title={title}
                aria-label={title}
                selected={value === $currentTranslation.value}
                value={value}
                className="truncate"
              >
                {flag && <span className="flag-icon">{flag}&nbsp;</span>}
                {innerText}
              </option>
            );
          })}
        </Select>
      </Label>
    </div>
  );
}
