import xrpl from "xrpl";

// create a pair of accounts
const serverURL = "wss://s.altnet.rippletest.net:51233"; // For testnet@

const mainCreate = async () => {
  const client = new xrpl.Client(serverURL);
  await client.connect();

  // do something useful
  console.log("lets fund 2 accounts...");
  const { wallet: wallet1, balance: balance1 } = await client.fundWallet();
  const { wallet: wallet2, balance: balance2 } = await client.fundWallet();

  console.log("wallet1", wallet1);
  console.log("wallet2", wallet2);

  console.log({
    balance1,
    address1: wallet1.address, //wallet1.seed
    balance2,
    address2: wallet2.address,
  });

  // end
  client.disconnect();
};

mainCreate();

//generate a payment transaction between the two accounts

const wallet1 = xrpl.Wallet.fromSeed("sEdVYquTyQbwn7URKzzdbJ6L4tx1n5u");
const wallet2 = xrpl.Wallet.fromSeed("sEdTxX3LJChazh9FDU51nVDd11n5nDQ");

// Call the function to read transactions

const mainCall = async () => {
  const client = new xrpl.Client(serverURL);
  await client.connect();

  // do something useful
  console.log("funding wallet");
  console.log(
    wallet1.classicAddress,
    await client.getBalances(wallet1.classicAddress),
  );
  console.log(
    wallet2.classicAddress,
    await client.getBalances(wallet2.classicAddress),
  );

  const tx: any = {
    TransactionType: "Payment",
    Account: wallet1.classicAddress,
    Destination: wallet2.classicAddress,
    Amount: "1234",
  };

  const result = await client.submitAndWait(tx, {
    autofill: true,
    wallet: wallet1,
  });
  console.log(result);

  // end
  client.disconnect();
};

mainCall();

//listen for transactions affecting a given account to catch all transactions

const walletAddress = "rfwGxAj4B1NkBihbuL83CiGjvsp9BVzrKX";

const main = async () => {
  const client = new xrpl.Client(serverURL);
  await client.connect();

  // do something useful
  const subscriptionRequest = {
    command: "subscribe",
    accounts: [walletAddress],
  };

  await client.request(subscriptionRequest);
  console.log(`Subscribed to transactions for account: ${walletAddress}`);

  // Event listener for incoming transactions
  client.on("transaction", (transaction) => {
    console.log("Transaction:", transaction);
  });

  // Event listener for errors
  client.on("error", (error) => {
    console.error("Error:", error);
  });

  // end
  // keep open
  console.log("all done");
};

main();
setInterval(() => {
  console.log("One second has passed!");
}, 1000);
