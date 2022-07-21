import "./App.css";
import { Home, InstallMetaMask } from "./components";
import { AppStateProvider } from "./state";
import { EthProvider } from "./eth-context";

export function App() {
  return (
    <AppStateProvider>
      {!(window as any).ethereum && <InstallMetaMask />}
      {(window as any).ethereum && (
        <>
          <EthProvider>
            <Home />
          </EthProvider>
        </>
      )}
    </AppStateProvider>
  );
}
