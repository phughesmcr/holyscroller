import { asset } from "$fresh/runtime.ts";
import type { PageProps } from "$fresh/server.ts";
import Loader from "@islands/Loader.tsx";
import Onboarding from "@islands/Onboarding.tsx";
import {
  APP_NAME,
  APP_TAGLINE,
  HTML_DIR,
  HTML_LANG,
  LINK_CANONICAL,
  META_AUTHOR,
  META_CHARSET,
  META_COLOR_SCHEME,
  META_DESCRIPTION,
  META_KEYWORDS,
  META_ROBOTS,
  META_THEME_COLOR,
  META_VIEWPORT,
} from "@lib/constants.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang={HTML_LANG} dir={HTML_DIR} prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
      <head>
        <meta charset={META_CHARSET} />
        <meta name="viewport" content={META_VIEWPORT} />
        <title>{APP_NAME} | {APP_TAGLINE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <meta name="keywords" content={META_KEYWORDS} />
        <meta name="robots" content={META_ROBOTS} />
        <meta name="author" content={META_AUTHOR} />

        <meta name="color-scheme" content={META_COLOR_SCHEME} />
        <meta name="theme-color" content={META_THEME_COLOR} />

        <meta name="application-name" content={APP_NAME} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />

        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        <meta name="msapplication-TileColor" content={META_THEME_COLOR} />
        <meta name="msapplication-TileImage" content={asset("img/ms-icon-144x144.png")} />
        <meta name="msapplication-tap-highlight" content="no" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en" />
        <meta property="og:title" content={`${APP_NAME} | ${APP_TAGLINE}`} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:url" content={LINK_CANONICAL} />
        <meta property="og:image" content={asset(`${LINK_CANONICAL}/img/android-icon-512x512.png`)} />
        <meta property="og:image:secure_url" content={asset(`${LINK_CANONICAL}/img/android-icon-512x512.png`)} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta
          property="og:image:alt"
          content="The logo for HolyScroller - an open bible with a cross emerging from the pages."
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${APP_NAME} | ${APP_TAGLINE}`} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <meta name="twitter:image:src" content={asset(`${LINK_CANONICAL}/img/card.png`)} />

        <link rel="apple-touch-icon" sizes="57x57" href={asset("img/apple-icon-57x57.png")} />
        <link rel="apple-touch-icon" sizes="60x60" href={asset("img/apple-icon-60x60.png")} />
        <link rel="apple-touch-icon" sizes="72x72" href={asset("img/apple-icon-72x72.png")} />
        <link rel="apple-touch-icon" sizes="76x76" href={asset("img/apple-icon-76x76.png")} />
        <link rel="apple-touch-icon" sizes="114x114" href={asset("img/apple-icon-114x114.png")} />
        <link rel="apple-touch-icon" sizes="120x120" href={asset("img/apple-icon-120x120.png")} />
        <link rel="apple-touch-icon" sizes="144x144" href={asset("img/apple-icon-144x144.png")} />
        <link rel="apple-touch-icon" sizes="152x152" href={asset("img/apple-icon-152x152.png")} />
        <link rel="apple-touch-icon" sizes="180x180" href={asset("img/apple-icon-180x180.png")} />
        <link rel="icon" type="image/png" sizes="192x192" href={asset("img/android-icon-192x192.png")} />
        <link rel="icon" type="image/png" sizes="32x32" href={asset("/favicon-32x32.png")} />
        <link rel="icon" type="image/png" sizes="96x96" href={asset("/favicon-96x96.png")} />
        <link rel="icon" type="image/png" sizes="16x16" href={asset("/favicon-16x16.png")} />

        <link rel="manifest" href={asset("/site.webmanifest")} crossorigin="use-credentials" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href={asset("/sitemap.xml")} />
        <link rel="canonical" href={LINK_CANONICAL} />
        <link rel="shortlink" href={LINK_CANONICAL.slice(12)} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <link rel="stylesheet" href={asset("/styles.css")} />
        <link
          rel="stylesheet"
          href={"https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600;700;800&display=swap"}
        />
      </head>
      <body className="no-interaction relative fill-available-height fill-available-width overflow-hidden bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Loader />
        <Onboarding />
        {/* {$showFab.value && <Fab />} */}
        <Component />
        <script src={asset("/pwa-loader.js")} type="module" />
      </body>
    </html>
  );
}
