import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Card({
  children,
  highlighted = false,
}: PropsWithChildren<{ highlighted?: boolean }>) {
  return (
    <div
      className={clsx(
        "flex flex-col group rounded-lg border-2 border-gray-100 m-4 min-h-[200px]",
        {
          "border-gray-200": highlighted,
          "border-gray-100": !highlighted,
        }
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({ children }: PropsWithChildren<{}>) {
  return <div className="grow flex justify-evenly">{children}</div>;
}

export function CardFooter({
  children,
  invisible = true,
}: PropsWithChildren<{ invisible?: boolean }>) {
  return (
    <div
      className={clsx("bg-gray-100 text-center", {
        "invisible group-hover:visible": invisible,
      })}
    >
      {children}
    </div>
  );
}
