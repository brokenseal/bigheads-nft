import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage, Home, InstallMetaMask } from "./components";
import { EthProvider } from "./eth-context";
import { AppStateProvider } from "./state";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppStateProvider>
        <EthProvider>
          <Home />
        </EthProvider>
      </AppStateProvider>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/install-metamask",
    element: <InstallMetaMask />,
    errorElement: <ErrorPage />,
  },
]);

export function App() {
  if (!(window as any).ethereum) {
    return <InstallMetaMask />;
  }

  return <RouterProvider router={router} />;
}
