import { EthProvider } from "../contexts/EthContext";

export function Home() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">Work in progress...</div>
      </div>
    </EthProvider>
  );
}
