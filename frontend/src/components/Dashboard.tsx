import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { useEth } from "../eth-context";
import { MintCard } from "./MintCard";
import { NFTImage } from "./NFTImage";
import { useHome } from "./useHome";
import { formatWeiValue } from "./utils";

export function Dashboard() {
  const ethContextState = useEth();
  const {
    minted,
    currentBalance,
    availableCount,
    handleUpdateBalance,
    handleMintedNftUpdate,
  } = useHome();
  const formattedBalance = useMemo(() => {
    if (currentBalance === undefined || !ethContextState?.eth?.web3) {
      return "Loading...";
    }

    const valueInWei = formatWeiValue(ethContextState.eth.web3, currentBalance);
    return `${valueInWei} ETH`;
  }, [currentBalance, ethContextState?.eth?.web3]);

  if (!ethContextState?.eth) {
    return null;
  }

  return (
    <>
      <div className="rounded-lg border-4 border-solid border-gray-200 p-4 mb-4">
        <p className="flex flex-row">
          Wallet Balance: {formattedBalance}
          <button
            onClick={handleUpdateBalance}
            title="Refresh"
            className="ml-4"
          >
            <ArrowPathIcon className="w-6 h-6 text-blue-500" />
          </button>
        </p>
        <p className="flex flex-row">
          BigHeads count: {minted.length}
          <button
            onClick={handleMintedNftUpdate}
            title="Refresh"
            className="ml-4"
          >
            <ArrowPathIcon className="w-6 h-6 text-blue-500" />
          </button>
        </p>
        <p className="flex flex-row">Available count: {availableCount}</p>
        {availableCount === 0 && (
          <p className="flex flex-row">No more NFTs to mint available</p>
        )}
      </div>
      <div className="rounded-lg border-4 border-solid border-gray-200 p-4">
        <div className="grid grid-cols-4">
          {minted.map((uri, index) => (
            // FIXME: index used as tokenId is not correct
            <NFTImage key={index} uri={uri} tokenId={index} />
          ))}
          {availableCount !== 0 && <MintCard onMint={handleMintedNftUpdate} />}
        </div>
      </div>
    </>
  );
}
