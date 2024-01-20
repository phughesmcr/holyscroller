import { Partial } from "$fresh/runtime.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { getExtrasForVerses, getPageOfVerses } from "@db";
import { $currentUrl, $currentVerse } from "@lib/state.ts";
import { ApiParams, ApiResponse, Verse, VerseId } from "@lib/types.ts";
import { createPartialFeedUrls, getApiParamsFromUrl, getIdFromKvEntry } from "@lib/utils.ts";
import Carousel from "../../islands/Carousel.tsx";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};

const getVerses = async (params: ApiParams): Promise<[verses: Verse[], iter: Deno.KvListIterator<string>]> => {
  const iter = await getPageOfVerses(params);
  const verses: Verse[] = [];
  for await (const verse of iter) {
    verses.push([getIdFromKvEntry(verse), verse.value]);
  }
  return [verses, iter];
};

const createResponse = async (req: Request): Promise<ApiResponse> => {
  const currentUrl = new URL(req.url);
  const params = getApiParamsFromUrl(req.url);
  const [verses, iter] = await getVerses(params);
  const { cursor } = iter;
  const next = {
    ...createPartialFeedUrls(currentUrl, { ...params, cursor }),
    cursor,
  };
  const extras = await getExtrasForVerses(verses);
  return { ...params, verses, extras, next, origin: currentUrl };
};

export default defineRoute(async (req, ctx) => {
  try {
    const res = await createResponse(req);
    $currentUrl.value = new URL(res.origin);
    $currentVerse.value = res.verses[0][0] as VerseId;
    return (
      <Partial name="carousel" mode="append">
        <Carousel res={res} />
      </Partial>
    );
  } catch (err) {
    console.error(err);
    return ctx.renderNotFound();
  }
});
