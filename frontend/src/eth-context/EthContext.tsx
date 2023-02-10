import { createContext } from "react";
import { EthContextState } from "./types";

export const EthContext = createContext<EthContextState | undefined>(undefined);
