import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../Layout";

export function Page({ children }: PropsWithChildren<{}>) {
  return (
    <Layout
      menuItems={
        <>
          <Link
            to="/"
            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
            aria-current="page"
          >
            Dashboard
          </Link>
          <Link
            to="/install-metamask"
            className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            aria-current="page"
          >
            Install Metamask
          </Link>
        </>
      }
    >
      {children}
    </Layout>
  );
}
