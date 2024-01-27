import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { LINK_CANONICAL, SQ_KEYS } from "@lib/constants.ts";
import { $currentPericopeIndex, $currentPericopes, $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { effect } from "@preact/signals";
import type { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

export default function PericopeSelect() {
  if (!IS_BROWSER) return <></>;

  const selectRef = useRef<HTMLSelectElement>(null);

  effect(() => {
    if (selectRef.current) {
      selectRef.current.value = $currentPericopeIndex.value.toString();
    }
  });

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = $currentPericopeIndex.value.toString();
    }
  }, []);

  const changePericope = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const list = $currentPericopes.peek();
    if (!list || !list.length) return;
    const current = list[parseInt(e.currentTarget.value, 10)];
    const res = deleteInessentialsFromUrl(new URL($currentUrl.peek() ?? location.href ?? LINK_CANONICAL));
    res.searchParams.set(SQ_KEYS.START_FROM, current.r[0].toString());
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-5/12 md:w-1/2 lg:w-1/3 min-w-[4ch]">
      <Label htmlFor="pericope-select">
        <span className="truncate">
          Section
        </span>
        <Select
          aria-label="Select a pericope"
          id="pericope-select"
          name="pericope-select"
          onChange={changePericope}
          ref={selectRef}
          title="Pericope"
          value={$currentPericopeIndex.value.toString()}
        >
          {$currentPericopes.value?.map((pericope, index) => {
            const { t, o } = pericope;
            return (
              <option
                key={o}
                title={t}
                aria-label={t}
                selected={index === $currentPericopeIndex.value}
                value={index.toString()}
              >
                {t}
              </option>
            );
          })}
        </Select>
      </Label>
    </div>
  );
}
