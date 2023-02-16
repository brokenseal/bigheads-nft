import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import BigHeadsArtifact from "@bigheads-nft/backend/build/contracts/BigHeads.json";
import { EthContext } from "./EthContext";
import { EthContextState } from "./types";

const localGanacheProvider = "ws://localhost:8545";

export type EthProviderProps = PropsWithChildren<{}>;

export function EthProvider({ children }: EthProviderProps) {
  const [ethContextState, setEthContextState] = useState<EthContextState>({});

  const init = useCallback(async () => {
    // if present in the page, Web3.givenProvider will equal (window as any).ethereum
    const provider = Web3.givenProvider || localGanacheProvider;

    const web3 = new Web3(provider);
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();
    // not sure why the abi type is not matching the automatically generated abi
    const abi = BigHeadsArtifact.abi as any;
    let contract: Contract;
    let address: string;

    try {
      address = (BigHeadsArtifact.networks as any)[networkID].address;
      contract = new web3.eth.Contract(abi, address);
    } catch (error) {
      setEthContextState((currentState) => ({
        ...currentState,
        error: error as Error,
      }));
    } finally {
      setEthContextState((currentState) => ({
        ...currentState,
        eth: {
          artifact: BigHeadsArtifact,
          web3,
          accounts,
          networkID,
          contract,
          contractAddress: address,
        },
      }));
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const handleChange = useCallback(() => init(), [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];

    events.forEach((e) => (window as any).ethereum?.on(e, handleChange));

    return () => {
      events.forEach((e) => (window as any).ethereum?.removeListener(e, handleChange));
    };
  }, [handleChange]);

  return (
    <EthContext.Provider value={ethContextState}>
      {children}
    </EthContext.Provider>
  );
}
