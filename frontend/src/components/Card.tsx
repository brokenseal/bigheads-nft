import { PropsWithChildren } from "react";
import clsx from "clsx";

export function Card({ children }: PropsWithChildren<{}>) {
  return (
    <div
      className={clsx(
        "flex flex-col group rounded-lg border-2 border-gray-100 m-4 min-h-[200px]"
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
  invisible = false,
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
