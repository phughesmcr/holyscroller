import { APP_NAME } from "@lib/constants.ts";
import type { ComponentChildren } from "preact";

type AppContainerProps = {
  children: ComponentChildren;
};

export default function AppContainer({ children }: AppContainerProps) {
  return (
    <div
      role="application"
      id="app-container"
      className="no-interaction isolate block box-border antialiased w-dvw h-dvh max-w-lvw max-h-lvh min-w-svw min-h-svh"
      name={APP_NAME}
      aria-label={APP_NAME}
    >
      <script type="application/ld+json">
        {{
          "@context": "http://schema.org",
          "@type": "WebApplication",
          "name": "HolyScroller",
          "url": "https://www.holyscroller.app",
          "description": "Scroll the scriptures!",
          "applicationCategory": "Lifestyle",
          "genre": "faith",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "0.1.0",
          "operatingSystem": "All",
        }}
      </script>
      <div
        id="outer-container"
        className="no-interaction absolute top-0 left-0 overflow-hidden w-full h-full z-0"
      >
        <div
          id="inner-container"
          className="no-interaction relative w-full h-full grid grid-cols-1"
        >
          {children}
        </div>
        s
      </div>
    </div>
  );
}
