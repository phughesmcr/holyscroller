import IconLoader3 from "@components/IconLoader.tsx";
import { $isLoading } from "@lib/state.ts";
import { effect } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  effect(() => {
    const isLoading = $isLoading.value;
    const { current } = loaderRef;
    if (isLoading) {
      current?.setAttribute("hidden", "false");
      current?.style.setProperty("display", "flex", "important");
      current?.style.setProperty("visibility", null, "important");
      current?.setAttribute("aria-hidden", "false");
    } else {
      current?.setAttribute("hidden", "true");
      current?.style.setProperty("display", "none", "important");
      current?.style.setProperty("visibility", "hidden", "important");
      current?.setAttribute("aria-hidden", "true");
    }
  });

  const handleLoading = () => {
    $isLoading.value = false;
  };

  useEffect(() => {
    const { window } = globalThis; // stops typescript complaining
    window.addEventListener("load", handleLoading, { passive: true });
    setTimeout(handleLoading, 1000);
    return () => window.removeEventListener("load", handleLoading);
  }, []);

  return (
    <div
      ref={loaderRef}
      hidden={!$isLoading.value}
      aria-hidden={!$isLoading.value}
      className="isolate absolute top-0 left-0 z-[100] w-full h-full flex flex-col justify-center items-center bg-zinc-700 text-zinc-100 opacity-90"
    >
      <IconLoader3 className="w-40 h-40 animate-spin" />
    </div>
  );
}
