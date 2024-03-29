// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_id_ from "./routes/[id].tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $bible_id_ from "./routes/bible/[id].tsx";
import * as $bible_index from "./routes/bible/index.tsx";
import * as $catechism_index from "./routes/catechism/index.tsx";
import * as $index from "./routes/index.tsx";
import * as $partials_feed from "./routes/partials/feed.tsx";
import * as $Carousel from "./islands/Carousel.tsx";
import * as $NavBar from "./islands/NavBar.tsx";
import * as $Searcher from "./islands/Searcher.tsx";
import * as $Toolbar_BookSelect from "./islands/Toolbar/BookSelect.tsx";
import * as $Toolbar_PericopeSelect from "./islands/Toolbar/PericopeSelect.tsx";
import * as $Toolbar_Toolbar from "./islands/Toolbar/Toolbar.tsx";
import * as $Toolbar_TranslationSelect from "./islands/Toolbar/TranslationSelect.tsx";
import * as $super_Fab from "./islands/super/Fab.tsx";
import * as $super_Loader from "./islands/super/Loader.tsx";
import * as $super_Onboarding from "./islands/super/Onboarding.tsx";
import * as $super_Resumer from "./islands/super/Resumer.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[id].tsx": $_id_,
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/bible/[id].tsx": $bible_id_,
    "./routes/bible/index.tsx": $bible_index,
    "./routes/catechism/index.tsx": $catechism_index,
    "./routes/index.tsx": $index,
    "./routes/partials/feed.tsx": $partials_feed,
  },
  islands: {
    "./islands/Carousel.tsx": $Carousel,
    "./islands/NavBar.tsx": $NavBar,
    "./islands/Searcher.tsx": $Searcher,
    "./islands/Toolbar/BookSelect.tsx": $Toolbar_BookSelect,
    "./islands/Toolbar/PericopeSelect.tsx": $Toolbar_PericopeSelect,
    "./islands/Toolbar/Toolbar.tsx": $Toolbar_Toolbar,
    "./islands/Toolbar/TranslationSelect.tsx": $Toolbar_TranslationSelect,
    "./islands/super/Fab.tsx": $super_Fab,
    "./islands/super/Loader.tsx": $super_Loader,
    "./islands/super/Onboarding.tsx": $super_Onboarding,
    "./islands/super/Resumer.tsx": $super_Resumer,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
