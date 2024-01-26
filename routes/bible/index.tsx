import { Partial } from "$fresh/runtime.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import AppContainer from "@components/AppContainer.tsx";
import { TopFade } from "@components/TopFade.tsx";
import { getExtrasForVerses, getPageOfVerses } from "@db";
import Carousel from "@islands/Carousel.tsx";
import Searcher from "@islands/Searcher.tsx";
import { $currentUrl, $currentVerse } from "@lib/state.ts";
import type { ApiParams, ApiResponse, Verse, VerseId } from "@lib/types.ts";
import { createPartialFeedUrls, getApiParamsFromUrl, getIdFromKvEntry, memoizeWithLimitedHistory } from "@lib/utils.ts";
import NavBar from "../../islands/NavBar.tsx";
import Toolbar from "../../islands/Toolbar/Toolbar.tsx";
import Resumer from "../../islands/super/Resumer.tsx";

const getVerses = async (params: ApiParams): Promise<[verses: Verse[], iter: Deno.KvListIterator<string>]> => {
  const iter = await getPageOfVerses(params);
  const verses: Verse[] = [];
  for await (const verse of iter) {
    verses.push([getIdFromKvEntry(verse), verse.value]);
  }
  return [verses, iter];
};

const createResponse = async (url: string): Promise<ApiResponse> => {
  const currentUrl = new URL(url);
  const params = getApiParamsFromUrl(url);
  const [verses, iter] = await getVerses(params);
  const { cursor } = iter;
  const next = {
    ...createPartialFeedUrls(currentUrl, { ...params, cursor }),
    cursor,
  };
  const extras = await getExtrasForVerses(verses);
  return { ...params, verses, extras, next, origin: currentUrl };
};

const createResponseMemoized = memoizeWithLimitedHistory(createResponse, 25);

export const handler: Handlers<ApiResponse | null> = {
  async GET(req, ctx) {
    try {
      const res = await createResponseMemoized(req.url.toString());
      $currentUrl.value = new URL(res.origin);
      return ctx.render(res);
    } catch (err) {
      console.error(err);
      return ctx.renderNotFound();
    }
  },
};

export default function Bible(props: PageProps<ApiResponse>) {
  const { data } = props;

  // update signals based on response
  $currentVerse.value = data.verses[0][0] as VerseId;

  return (
    <AppContainer>
      <main role="main" className="min-w-0 min-h-0 w-full h-full" f-client-nav>
        <Resumer res={data} />
        <TopFade />
        <Toolbar />
        <Searcher />
        <div
          role="feed"
          aria-busy="false" // TODO: need to trigger this on load
          className="w-full h-full overflow-x-hidden overflow-y-auto hide-scrollbars touch-pan-y snap-y snap-mandatory p-2 overscroll-touch"
        >
          <Partial name="carousel" mode="append">
            <Carousel res={data as ApiResponse} />
          </Partial>
        </div>
      </main>
      <NavBar />
    </AppContainer>
  );
}
