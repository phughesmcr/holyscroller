import type { JSX } from "preact";

export function TopFade(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`w-full h-1/4 absolute top-0 left-0 bg-gradient-to-b from-zinc-100 dark:from-zinc-950 to-transparent pointer-events-none z-10`}
    />
  );
}
