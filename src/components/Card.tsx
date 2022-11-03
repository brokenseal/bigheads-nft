import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren<{}>) {
  return (
    <div className="flex flex-col group rounded-lg border-2 border-gray-100 m-4 min-h-[200px]">
      {children}
    </div>
  );
}

export function CardBody({ children }: PropsWithChildren<{}>) {
  return <div className="grow flex justify-evenly">{children}</div>;
}

export function CardFooter({ children }: PropsWithChildren<{}>) {
  return (
    <div className="invisible group-hover:visible bg-gray-100 text-center">
      {children}
    </div>
  );
}
