import { LS_KEYS, SQ_KEYS } from "@lib/constants.ts";
import { ApiResponse } from "@lib/types.ts";
import { deleteInessentialsFromUrl } from "@lib/utils.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Resumer(props: { res: ApiResponse }) {
  if (!IS_BROWSER) return <></>;

  const { res } = props;

  if (res.resume) {
    const url = deleteInessentialsFromUrl(res.origin);
    const translation = localStorage?.getItem(LS_KEYS.TRANSLATION);
    const startFrom = localStorage?.getItem(LS_KEYS.START_FROM);
    const endAt = localStorage?.getItem(LS_KEYS.END_AT);
    const cursor = localStorage?.getItem(LS_KEYS.CURSOR);
    const pageSize = localStorage?.getItem(LS_KEYS.PAGE_SIZE);
    if (translation) url.searchParams.set(SQ_KEYS.TRANSLATION, translation);
    if (startFrom) url.searchParams.set(SQ_KEYS.START_FROM, startFrom);
    if (endAt) url.searchParams.set(SQ_KEYS.END_AT, endAt);
    if (cursor) url.searchParams.set(SQ_KEYS.CURSOR, cursor);
    if (pageSize) url.searchParams.set(SQ_KEYS.PAGE_SIZE, pageSize);
    if (location) location.href = url.toString();
  }

  return <></>;
}
