import "./App.css";
import { Home, Install } from "./components";

export function App() {
  if (!window.ethereum) {
    return <Install />;
  }

  return <Home />;
}
