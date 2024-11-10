import {
  Client,
  Wallet,
  convertStringToHex,
  NFTokenMint,
  NFTokenMintFlags,
  NFTokenCreateOffer,
  TransactionMetadata,
} from "xrpl";

// Connexion au client XRPL
const client = new Client("wss://s.altnet.rippletest.net:51233");

const main = async () => {
  console.log("Let's get started...");
  await client.connect();

  // Créer un portefeuille
  const { wallet } = await client.fundWallet();
  console.log("Wallet address:", wallet.address);

  // URI du NFT
  const uri = "https://example.com/my-nft-metadata.json";

  // Étape 1: Frapper (mint) le NFT
  const nftMintTx: NFTokenMint = {
    TransactionType: "NFTokenMint",
    Account: wallet.address,
    URI: convertStringToHex(uri), // Convertir l'URI en hexadécimal
    Flags: NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfTransferable,
    NFTokenTaxon: 0,
  };

  const preparedMint = await client.autofill(nftMintTx);
  const signedMint = wallet.sign(preparedMint);
  const mintResult = await client.submitAndWait(signedMint.tx_blob);

  // Vérification de la réussite de la transaction
  const meta = mintResult.result.meta as TransactionMetadata;
  if (meta && meta.TransactionResult === "tesSUCCESS") {
    console.log("NFT minting transaction successful!");

    // Extraire l'ID du NFT
    const nftId = (meta as any).nftoken_id; // Accès forcé à l'ID du NFT
    console.log("NFT ID " + nftId + " created");

    // Étape 2 : Créer une offre de vente pour le NFT
    const nftCreateOfferTx: NFTokenCreateOffer = {
      TransactionType: "NFTokenCreateOffer",
      Account: wallet.address,
      NFTokenID: nftId,
      Amount: "1000000",
      Flags: 1,
    };

    const preparedOffer = await client.autofill(nftCreateOfferTx);
    const signedOffer = wallet.sign(preparedOffer);
    const offerResult = await client.submitAndWait(signedOffer.tx_blob);

    const offerMeta = offerResult.result.meta as TransactionMetadata;
    if (offerMeta && offerMeta.TransactionResult === "tesSUCCESS") {
      const offerId = (offerMeta as any).offer_id; // Accès forcé à l'ID de l'offre
      console.log("Offer ID " + offerId + " created");
      console.log("NFT is now on sale for 1 XRP");
    } else {
      console.log("Failed to create offer:", offerResult);
    }
  } else {
    console.log("NFT minting transaction failed:", mintResult);
  }

  await client.disconnect();
  console.log("All done!");
};

main().catch(console.error);
