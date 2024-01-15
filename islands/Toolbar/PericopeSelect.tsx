import { IS_BROWSER } from "$fresh/runtime.ts";
import { Label } from "@components/Label.tsx";
import { Select } from "@components/Select.tsx";
import { LINK_CANONICAL, SQ_KEYS } from "@lib/constants.ts";
import { $currentPericope, $currentPericopeIndex, $currentPericopes, $currentUrl } from "@lib/state.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import type { JSX } from "preact";

export default function PericopeSelect() {
  if (!IS_BROWSER) return <></>;

  const changePericope = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    const list = $currentPericopes.peek();
    if (!list) return;
    const current = list[parseInt(e.currentTarget.value, 10)];
    const res = deleteInessentialsFromUrl(new URL($currentUrl.peek() ?? location.href ?? LINK_CANONICAL));
    res.searchParams.set(SQ_KEYS.START_FROM, current.r[0].toString());
    $currentUrl.value = res;
    location.href = res.toString();
  };

  return (
    <div className="w-5/12 md:w-1/2 lg:w-1/3 min-w-[4ch]">
      <Label htmlFor="pericope-select">
        Section
        <Select
          title="Pericope"
          aria-label="Select a pericope"
          name="pericope-select"
          id="pericope-select"
          value={$currentPericopeIndex.value}
          onChange={changePericope}
        >
          {$currentPericopes.value?.map((pericope, index) => {
            const { t, o } = pericope;
            return (
              <option
                key={o}
                title={t}
                aria-label={t}
                selected={t === $currentPericope.value?.t}
                value={index}
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
