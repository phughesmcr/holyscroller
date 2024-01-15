import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { API_DEFAULT_TRANSLATION, LINK_CANONICAL, SQ_KEYS, TRANSLATIONS } from "@lib/constants.ts";
import { $currentTranslation, $currentUrl } from "@lib/state.ts";
import { Translation } from "@lib/types.ts";
import { effect, useSignal } from "@preact/signals";
import type { JSX } from "preact";

export default function TranslationSelect() {
  if (!IS_BROWSER) return <></>;

  const selectedTranslation = useSignal<Translation>(API_DEFAULT_TRANSLATION);

  effect(() => {
    selectedTranslation.value = $currentTranslation.value;
  });

  const changeTranslation = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const res = new URL($currentUrl.peek() ?? location?.href ?? LINK_CANONICAL);
    res.searchParams.set(SQ_KEYS.TRANSLATION, e.currentTarget.value);
    selectedTranslation.value = e.currentTarget.value as Translation;
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-3/12 min-w-[5ch]">
      <Label htmlFor="translation-select">
        <span class="truncate">
          Trans.
        </span>
        <Select
          title="Bible Translation"
          aria-label="Choose a bible translation"
          name="translation-select"
          id="translation-select"
          onChange={changeTranslation}
          value={selectedTranslation}
        >
          {TRANSLATIONS.map((trans) => {
            const { flag, innerText, title, value } = trans;
            return (
              <option
                title={title}
                aria-label={title}
                selected={selectedTranslation.value === value}
                value={value}
                class="truncate"
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
