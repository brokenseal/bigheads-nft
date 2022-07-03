import "./App.css";
import { Home, InstallMetaMask } from "./components";
import { AppStateProvider } from "./state";
import { EthProvider } from "./eth-context";

export function App() {
  return (
    <AppStateProvider>
      {!window.ethereum && <InstallMetaMask />}
      {window.ethereum && (
        <>
          <EthProvider>
            <Home />
          </EthProvider>
        </>
      )}
    </AppStateProvider>
  );
}
