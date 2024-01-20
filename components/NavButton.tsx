import type { ComponentChildren, JSX } from "preact";

type NavButtonProps = {
  innerText: string;
  children: ComponentChildren;
} & JSX.HTMLAttributes<HTMLAnchorElement>;

export default function NavButton(props: NavButtonProps) {
  const { children, href, innerText } = props;
  return (
    <a
      href={href}
      className="flex flex-col flex-1 flex-nowrap items-center justify-center overflow-hidden"
    >
      <div>
        {children}
      </div>
      <span className="text-xs text-ellipsis whitespace-nowrap text-center">
        {innerText}
      </span>
    </a>
  );
}
