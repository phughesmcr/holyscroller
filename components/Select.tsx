import { IS_BROWSER } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export function Select(props: JSX.HTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      className={`px-2 py-1 rounded-full text-black bg-white hover:bg-gray-200 transition-colors w-full h-full shrink`}
    />
  );
}
