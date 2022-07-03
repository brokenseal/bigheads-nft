import { PropsWithChildren, useReducer } from "react";
import { AppStateContext } from "./AppStateContext";
import { initialState, reducer } from "./state";

export function AppStateProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}
