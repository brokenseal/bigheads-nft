import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { useEth } from "../eth-context";
import { NFTImage } from "./NFTImage";
import { useHome } from "./useHome";
import { formatWeiValue } from "./utils";

export function Dashboard() {
  const ethContextState = useEth();
  const {
    bigHeadsCount,
    currentBalance,
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
          BigHeads count: {bigHeadsCount}
          <button
            onClick={handleMintedNftUpdate}
            title="Refresh"
            className="ml-4"
          >
            <ArrowPathIcon className="w-6 h-6 text-blue-500" />
          </button>
        </p>
      </div>
      <div className="rounded-lg border-4 border-solid border-gray-200 p-4">
        <div className="grid grid-cols-4">
          {new Array(bigHeadsCount + 1).fill(null).map((_, i) => {
            return (
              <NFTImage key={i} tokenId={i} onMinted={handleMintedNftUpdate} />
            );
          })}
        </div>
      </div>
    </>
  );
}
