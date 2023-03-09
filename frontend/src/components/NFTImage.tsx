import { useEffect, useState } from "react";
import { useEth } from "../eth-context";
import { Card, CardBody, CardFooter } from "./Card";

type NFTImageProps = { tokenId: number };

export function NFTImage({ tokenId }: NFTImageProps) {
  const title = `BigHead ${tokenId}`;
  const ethContextState = useEth();
  const [isOwner, setIsOwner] = useState(false);
  const [tokenUri, setTokenUri] = useState("");

  useEffect(() => {
    const contract = ethContextState?.eth?.contract;
    const currentAccount = ethContextState?.eth?.accounts[0];

    if (!contract || !currentAccount) {
      return;
    }

    contract.methods
      .ownerOf(tokenId)
      .call({ from: currentAccount })
      .then((owner: string) => {
        setIsOwner(currentAccount === owner);
      })
      .catch((_error: unknown) => {
        // TODO: notify the user
      });

    contract.methods
      .tokenURI(tokenId)
      .call({ from: currentAccount })
      .then((tokenUri: string) => {
        setTokenUri(tokenUri);
      })
      .catch((_error: unknown) => {
        // TODO: notify the user
      });
  }, [ethContextState?.eth, tokenId]);

  return (
    <Card>
      <CardFooter>BigHead #{tokenId}</CardFooter>
      <CardBody>
        <img src={tokenUri} title={title} alt={title} className="max-width" />
      </CardBody>
      {isOwner && <CardFooter invisible>You own this one!</CardFooter>}
    </Card>
  );
}
