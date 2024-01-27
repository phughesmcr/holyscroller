import { $fabUrl, $showFab } from "@lib/state.ts";
import { effect } from "@preact/signals";
import IconLocation from "icons/location.tsx";
import { useCallback, useRef } from "preact/hooks";

export default function Fab() {
  const fabRef = useRef<HTMLDivElement>(null);

  const findAChurchNearYou = useCallback(() => {
    const successCallback: PositionCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const url = new URL("https://www.achurchnearyou.com/search/");
      url.searchParams.set("lat", `${latitude}`);
      url.searchParams.set("lon", `${longitude}`);
      $fabUrl.value = url;
    };
    const errorCallback: PositionErrorCallback = (error: GeolocationPositionError) => {
      console.error(error);
    };
    navigator?.geolocation?.getCurrentPosition(successCallback, errorCallback);
  }, []);

  effect(() => {
    if (!$showFab.value) {
      fabRef.current?.style.setProperty("display", "none", "important");
      fabRef.current?.style.setProperty("visibility", "hidden", "important");
    } else {
      fabRef.current?.style.setProperty("display", "flex", "important");
      fabRef.current?.style.setProperty("visibility", null, "important");
    }
  });

  const hideFab = useCallback(() => {
    $showFab.value = false;
  }, []);

  effect(() => {
    findAChurchNearYou();
  });

  return (
    <div ref={fabRef}>
      <div
        hidden={!$showFab.value}
        aria-hidden={!$showFab.value}
        className="absolute top-32 left-8 w-4 h-4 rounded-full bg-zinc-900 text-white shadow-md z-40 cursor-pointer opacity-90 flex justify-center items-center"
        onClick={hideFab}
      >
        &times;
      </div>
      <div
        hidden={!$showFab.value}
        aria-hidden={!$showFab.value}
        className="absolute top-32 left-[-10px] w-12 h-12 rounded-full bg-amber-200 shadow-xl z-30 cursor-pointer border-2 border-solid border-yellow-50 opacity-90"
        aria-label="A floating button which links to a church near you"
        title="Find a church near you"
      >
        <a
          href={$fabUrl.value.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center items-center text-black w-full h-full"
        >
          <IconLocation className="w-8 h-8" />
          <span className="sr-only">Find a church near you</span>
        </a>
      </div>
    </div>
  );
}
