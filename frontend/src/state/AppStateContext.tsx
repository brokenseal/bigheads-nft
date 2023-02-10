import { createContext, Dispatch } from "react";
import { Action, AppState, initialState } from "./state";

export const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => initialState,
});
