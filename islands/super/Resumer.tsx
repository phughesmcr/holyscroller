import { IS_BROWSER } from "$fresh/runtime.ts";
import { LS_KEYS, SQ_KEYS } from "@lib/constants.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";

type ResumerProps = {
  resume?: boolean;
  origin: string | URL;
};

export default function Resumer(props: ResumerProps) {
  if (!IS_BROWSER) return <></>;

  const { resume = false, origin } = props;

  if (resume) {
    const url = deleteInessentialsFromUrl(origin);

    const translation = localStorage?.getItem(LS_KEYS.TRANSLATION);
    if (translation) url.searchParams.set(SQ_KEYS.TRANSLATION, translation);

    const startFrom = localStorage?.getItem(LS_KEYS.START_FROM);
    if (startFrom) url.searchParams.set(SQ_KEYS.START_FROM, startFrom);

    const endAt = localStorage?.getItem(LS_KEYS.END_AT);
    if (endAt) url.searchParams.set(SQ_KEYS.END_AT, endAt);

    const cursor = localStorage?.getItem(LS_KEYS.CURSOR);
    if (cursor) url.searchParams.set(SQ_KEYS.CURSOR, cursor);

    const pageSize = localStorage?.getItem(LS_KEYS.PAGE_SIZE);
    if (pageSize) url.searchParams.set(SQ_KEYS.PAGE_SIZE, pageSize);

    location.href = url.toString();
  }

  return <></>;
}
