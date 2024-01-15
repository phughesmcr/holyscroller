import type { JSX } from "preact";

export function Label(props: JSX.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      class={`flex flex-col items-center justify-start max-w-full max-h-full w-full h-full shrink`}
    />
  );
}
