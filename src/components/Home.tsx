import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { useEth } from "../eth-context";
import { useHome } from "./useHome";
import { formatWeiValue } from "./utils";

export function Home() {
  const ethContextState = useEth();
  const {
    bigHeadsCount,
    currentBalance,
    handleUpdateBalance,
    handleMintedNftUpdate,
  } = useHome();

  return (
    <div id="App">
      {ethContextState?.eth && (
        <div>
          <h3>Balance</h3>
          <p>
            {currentBalance === undefined
              ? "Loading..."
              : formatWeiValue(ethContextState?.eth?.web3, currentBalance)}
          </p>
          <button onClick={handleUpdateBalance}>Update balance</button>
          <h3>Count</h3>
          <p>{bigHeadsCount}</p>
          <button onClick={handleMintedNftUpdate}>Update count</button>
          <div>
            {new Array(bigHeadsCount + 1).fill(null).map((_, i) => {
              return (
                <NFTImage
                  key={i}
                  tokenId={i}
                  onMinted={handleMintedNftUpdate}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

type NFTImageProps = { tokenId: number; onMinted: () => void };

function NFTImage({ tokenId, onMinted }: NFTImageProps) {
  const contentId = "QmfKtL2wpvRYccs2CeCM8EYzrhZgBqGe1zxETxVh5vncUH";
  const metaDataId = `${contentId}/${tokenId}`;
  const metaDataURI = `${metaDataId}.json`;
  // const imageURI = `https://gateway.pinata.cloud/ipfs/${metaDataId}.png`;
  const imageURI = `img/${tokenId}.png`;

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
  ]);

  if (!isMinted) {
    return <button onClick={mintNewBigHead}>Mint!</button>;
  }

  return (
    <div>
      {imageURI} - {tokenId} - {isMinted}
    </div>
  );
}
