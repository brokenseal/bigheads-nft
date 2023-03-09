import { BeakerIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { useEth } from "../eth-context";
import { Card, CardBody, CardFooter } from "./Card";

type MintCardProps = { onMint: (error?: unknown) => void };

export function MintCard({ onMint }: MintCardProps) {
  const { mintNewBigHead } = useMintCard({ onMint });

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

function useMintCard({ onMint }: MintCardProps) {
  const ethContextState = useEth();

  const mintNewBigHead = useCallback(async () => {
    const account = ethContextState?.eth?.accounts[0];
    const contract = ethContextState?.eth?.contract;

    if (!account || !contract) {
      // TODO: inform the user
      return;
    }
    let transactionReceipt: TransactionReceipt | undefined;

    try {
      transactionReceipt = await contract.methods.mint(account).send({
        // transactionReceipt = await contract.methods.mint(account).call({
        from: account,
        value: Web3.utils.toWei("0.01"),
        gasLimit: 6_721_975,
      });
    } catch (error) {
      onMint(error);
    }

    if (transactionReceipt) {
      const mintTransactionResult = transactionReceipt?.events?.Transfer
        .returnValues as {
        from: string;
        to: string;
        tokenId: string;
      };

      if (transactionReceipt && mintTransactionResult) {
        onMint();
      } else {
        onMint(new Error("An unknown error happened while minting"));
      }
    }
  }, [ethContextState?.eth?.accounts, ethContextState?.eth?.contract, onMint]);

  return { mintNewBigHead };
}
