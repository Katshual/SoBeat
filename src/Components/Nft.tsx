import React, { useState } from "react";
import {
  Client,
  NFTokenMint,
  NFTokenCreateOffer,
  TransactionMetadata,
} from "xrpl";
import { convertStringToHex } from "xrpl";

const NftComponent: React.FC = () => {
  const [nftId, setNftId] = useState<string | null>(null);
  const [offerId, setOfferId] = useState<string | null>(null);

  const mintNft = async () => {
    const client = new Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const { wallet } = await client.fundWallet();
    const uri = "https://example.com/my-nft-metadata.json"; // Remplace par ton URI

    const nftMintTx: NFTokenMint = {
      TransactionType: "NFTokenMint",
      Account: wallet.address,
      URI: convertStringToHex(uri),
      Flags: 1, // Flags pour rendre le NFT brûlable et transférable
      NFTokenTaxon: 0,
    };

    const preparedMint = await client.autofill(nftMintTx);
    const signedMint = wallet.sign(preparedMint);
    const mintResult = await client.submitAndWait(signedMint.tx_blob);

    const meta = mintResult.result.meta as TransactionMetadata;
    if (meta && meta.TransactionResult === "tesSUCCESS") {
      const nftId = (meta as any).nftoken_id; // Récupérer l'ID du NFT
      setNftId(nftId);
      console.log("NFT créé avec succès, ID:", nftId);
    } else {
      console.log("Échec de la création du NFT:", mintResult);
    }

    await client.disconnect();
  };

  const createOffer = async () => {
    if (!nftId) {
      console.error("NFT ID manquant");
      return;
    }

    const client = new Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const { wallet } = await client.fundWallet();
    const nftCreateOfferTx: NFTokenCreateOffer = {
      TransactionType: "NFTokenCreateOffer",
      Account: wallet.address,
      NFTokenID: nftId,
      Amount: "1000000", // Montant en drops (1 XRP = 1000000 drops)
      Flags: 1, // Flags pour la transaction
    };

    const preparedOffer = await client.autofill(nftCreateOfferTx);
    const signedOffer = wallet.sign(preparedOffer);
    const offerResult = await client.submitAndWait(signedOffer.tx_blob);

    const offerMeta = offerResult.result.meta as TransactionMetadata;
    if (offerMeta && offerMeta.TransactionResult === "tesSUCCESS") {
      const offerId = (offerMeta as any).offer_id;
      setOfferId(offerId);
      console.log("Offre créée avec succès, ID:", offerId);
    } else {
      console.log("Échec de la création de l'offre:", offerResult);
    }

    await client.disconnect();
  };

  return (
    <div>
      <h2>Créer un NFT</h2>
      <button onClick={mintNft}>Frapper un NFT</button>
      {nftId && <p>Le NFT a été créé avec l'ID: {nftId}</p>}
      <button onClick={createOffer} disabled={!nftId}>
        Créer une offre pour le NFT
      </button>
      {offerId && <p>L'offre a été créée avec l'ID: {offerId}</p>}
    </div>
  );
};

export default NftComponent;
