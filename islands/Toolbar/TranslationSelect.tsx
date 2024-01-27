import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { API_DEFAULT_TRANSLATION, LINK_CANONICAL, SQ_KEYS, TRANSLATIONS } from "@lib/constants.ts";
import { $currentParams, $currentUrl } from "@lib/state.ts";
import { effect, useSignal } from "@preact/signals";
import { escapeSql } from "escape";
import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

export default function TranslationSelect() {
  if (!IS_BROWSER) return <></>;

  const selectedTranslation = useSignal("");
  const selectRef = useRef<HTMLSelectElement>(null);

  effect(() => {
    const translation = $currentParams.value?.translation || API_DEFAULT_TRANSLATION;
    if (selectRef.current) {
      selectedTranslation.value = translation;
      selectRef.current.value = translation;
    }
  });

  useEffect(() => {
    const translation = $currentParams.value?.translation || API_DEFAULT_TRANSLATION;
    if (selectRef.current) {
      selectedTranslation.value = translation;
      selectRef.current.value = translation;
    }
  }, []);

  const changeTranslation = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const res = new URL($currentUrl.peek() ?? location?.href ?? LINK_CANONICAL);
    const selection = escapeSql(e.currentTarget.value);
    res.searchParams.set(SQ_KEYS.TRANSLATION, selection);
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
          aria-label="Choose a bible translation"
          id="translation-select"
          name="translation-select"
          onChange={changeTranslation}
          ref={selectRef}
          title="Bible Translation"
          value={selectedTranslation.value}
        >
          {TRANSLATIONS.map((trans) => {
            const { flag, innerText, title, value } = trans;
            return (
              <option
                key={value}
                title={title}
                aria-label={title}
                selected={value === selectedTranslation.value}
                value={value}
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
