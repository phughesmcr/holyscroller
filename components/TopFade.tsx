import type { JSX } from "preact";

export function TopFade(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={`w-full h-1/3 absolute top-0 left-0 bg-gradient-to-b from-white dark:from-black to-transparent pointer-events-none z-10`}
    />
  );
}
