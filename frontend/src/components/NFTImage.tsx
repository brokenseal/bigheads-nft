import { useEffect, useState } from "react";
import { useEth } from "../eth-context";
import { Card, CardBody, CardFooter } from "./Card";

type NFTImageProps = { uri: string; tokenId: number };

export function NFTImage({ uri, tokenId }: NFTImageProps) {
  const title = `BigHead ${tokenId}`;
  const ethContextState = useEth();
  const [isOwner, setIsOwner] = useState(false);

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
  }, [ethContextState?.eth, tokenId]);

  return (
    <Card>
      <CardBody>
        <img src={uri} title={title} alt={title} className="max-width" />
      </CardBody>
      <CardFooter>BigHead #{tokenId}</CardFooter>
      {isOwner && <CardFooter invisible={false}>You own this one!</CardFooter>}
    </Card>
  );
}
