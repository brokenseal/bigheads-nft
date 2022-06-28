import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import Web3 from "web3";
import BigHeadsArtifact from "../../contracts/BigHeads.json";
import { actions, AppState, initialState, reducer } from "./state";

export const EthContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppState>;
}>({
  state: initialState,
  dispatch: () => initialState,
});

export function EthProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();
    const { abi } = BigHeadsArtifact;
    let address, contract;

    try {
      address = (BigHeadsArtifact.networks as any)[networkID].address;
      contract = new web3.eth.Contract(abi as any, address);
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: actions.init,
      data: { artifact: BigHeadsArtifact, web3, accounts, networkID, contract },
    });
  }, []);

  // useEffect(() => {
  //   const tryInit = async () => {
  //     try {
  //       const artifact = require("../../contracts/SimpleStorage.json");
  //       init(artifact);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   tryInit();
  // }, [init]);

  const handleChange = useCallback(() => init(), [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];

    events.forEach((e) => window.ethereum?.on(e, handleChange));

    return () => {
      events.forEach((e) => window.ethereum?.removeListener(e, handleChange));
    };
  }, [handleChange]);

  return (
    <EthContext.Provider value={{ state, dispatch }}>
      {children}
    </EthContext.Provider>
  );
}
