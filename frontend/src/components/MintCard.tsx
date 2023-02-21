import { BeakerIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { useEth } from "../eth-context";
import { Card, CardBody, CardFooter } from "./Card";

type MintCardProps = { onMint: () => void };

export function MintCard({ onMint }: MintCardProps) {
  const ethContextState = useEth();

  const mintNewBigHead = useCallback(async () => {
    const account = ethContextState?.eth?.accounts[0];
    const contract = ethContextState?.eth?.contract;

    if (!account || !contract) {
      // TODO: inform the user
      return;
    }

    const transactionReceipt: TransactionReceipt | undefined =
      await contract.methods.mint(account).send({
        from: account,
        value: Web3.utils.toWei("0.01"),
      });

    const mintTransactionResult = transactionReceipt?.events?.Transfer
      .returnValues as {
      from: string;
      to: string;
      tokenId: string;
    };

    if (transactionReceipt && mintTransactionResult) {
      onMint();
    } else {
      // TODO: inform the user
    }
  }, [ethContextState?.eth?.accounts, ethContextState?.eth?.contract, onMint]);

  return (
    <Card>
      <CardBody>
        <button onClick={mintNewBigHead} title="Mint!">
          <BeakerIcon className="w-36 h-36 text-blue-500" />
        </button>
      </CardBody>
      <CardFooter invisible>Mint one!</CardFooter>
    </Card>
  );
}
