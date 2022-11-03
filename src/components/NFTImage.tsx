import { BeakerIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { useEth } from "../eth-context";
import { Card, CardBody, CardFooter } from "./Card";

type NFTImageProps = { tokenId: number; onMinted: () => void };
const contentId = "QmfKtL2wpvRYccs2CeCM8EYzrhZgBqGe1zxETxVh5vncUH";

export function NFTImage({ tokenId, onMinted }: NFTImageProps) {
  const metaDataId = `${contentId}/${tokenId}`;
  const metaDataURI = `${metaDataId}.json`;
  // const imageURI = `https://gateway.pinata.cloud/ipfs/${metaDataId}.png`;
  const imageURI = `/bigheads/generated/bighead_${tokenId}.svg`;

  const ethContextState = useEth();

  const [isMinted, setIsMinted] = useState(false);

  const getMintedStatus = useCallback(async () => {
    const result: boolean | undefined =
      await ethContextState?.eth?.contract?.methods
        .isContentOwned(metaDataURI)
        .call({ from: ethContextState?.eth?.accounts[0] });

    setIsMinted(!!result);
  }, [
    ethContextState?.eth?.contract,
    ethContextState?.eth?.accounts,
    metaDataURI,
  ]);

  useEffect(() => {
    getMintedStatus();
  }, [getMintedStatus]);

  const mintNewBigHead = useCallback(async () => {
    const transactionReceipt: TransactionReceipt | undefined =
      await ethContextState?.eth?.contract?.methods
        .mint(ethContextState.eth?.accounts[0], metaDataURI)
        .send({
          from: ethContextState.eth.accounts[0],
          value: Web3.utils.toWei("0.01"),
        });
    const minedTokenId = (
      transactionReceipt?.events?.Transfer.returnValues as {
        from: string;
        to: string;
        tokenId: string;
      }
    ).tokenId;
    console.log(minedTokenId, transactionReceipt);
    getMintedStatus();

    if (transactionReceipt && minedTokenId) {
      onMinted();
    }
  }, [
    ethContextState?.eth?.accounts,
    ethContextState?.eth?.contract,
    metaDataURI,
    getMintedStatus,
    onMinted,
  ]);

  if (!isMinted) {
    return (
      <Card>
        <CardBody>
          <button onClick={mintNewBigHead} title="Mint!">
            <BeakerIcon className="w-36 h-36 text-blue-500" />
          </button>
        </CardBody>
        <CardFooter>Mint one!</CardFooter>
      </Card>
    );
  }

  const title = `BigHead ${tokenId}`;

  return (
    <Card>
      <CardBody>
        <img src={imageURI} title={title} alt={title} className="max-width" />
      </CardBody>
      <CardFooter>BigHead#{tokenId}</CardFooter>
    </Card>
  );
}
