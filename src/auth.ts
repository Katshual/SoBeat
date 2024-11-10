import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { XrplPrivateKeyProvider } from "@web3auth/xrpl-provider";

// Configuration de la chaîne XRPL (testnet)
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: "xrpl:testnet",
  rpcTarget: "<https://s.altnet.rippletest.net:51234>",
  displayName: "XRP Ledger Testnet",
  blockExplorerUrl: "<https://testnet.xrpl.org>",
  ticker: "XRP",
  tickerName: "XRP",
};

// Configuration du fournisseur de clé privée XRPL
const privateKeyProvider = new XrplPrivateKeyProvider({
  config: { chainConfig },
});

// Configuration de Web3Auth
const web3authOptions = {
  clientId:
    "BEn0nMacacZUqSbJhnuDx1W6rFJG7W_kl2GtewG0c0YXcE20HJQqt5NKfpl5H5A3m6LnmOK8Oxjao1RYcrs305k", // Remplacez par votre vrai Client ID
  web3AuthNetwork: "testnet",
  chainConfig,
  uiConfig: {
    theme: "dark",
    loginMethodsOrder: ["google", "facebook"],
    appLogo: "<https://votre-logo-url.com/logo.png>", // Remplacez par l'URL de votre logo
  },
  privateKeyProvider,
};

class Auth {
  private web3auth: Web3Auth | null = null;
  private provider: IProvider | null = null;

  async init(): Promise<void> {
    this.web3auth = new Web3Auth(web3authOptions as any);
    await this.web3auth.initModal();
    console.log("Web3Auth initialisé");
  }

  async connect(): Promise<IProvider | null> {
    if (!this.web3auth) {
      throw new Error("Web3Auth n'est pas initialisé");
    }
    this.provider = await this.web3auth.connect();
    return this.provider;
  }

  async getUserInfo() {
    if (!this.web3auth) {
      throw new Error("Web3Auth n'est pas initialisé");
    }
    const user = await this.web3auth.getUserInfo();
    console.log("Informations utilisateur:", user);
    return user;
  }

  async logout(): Promise<void> {
    if (!this.web3auth) {
      throw new Error("Web3Auth n'est pas initialisé");
    }
    await this.web3auth.logout();
    this.provider = null;
    console.log("Déconnexion réussie");
  }

  async getAccounts(): Promise<string[]> {
    if (!this.provider) {
      throw new Error("Le fournisseur n'est pas initialisé");
    }
    const accounts = await this.provider.request({
      method: "xrpl_getAccounts",
    });
    return accounts as string[];
  }

  async getBalance(): Promise<string> {
    if (!this.provider) {
      throw new Error("Le fournisseur n'est pas initialisé");
    }
    const accounts = await this.getAccounts();
    const balance = await this.provider.request({
      method: "xrpl_getBalance",
      params: { account: accounts[0] },
    });
    return balance as string;
  }
}

// Fonction pour tester l'authentification
async function testAuth() {
  const auth = new Auth();
  try {
    await auth.init();
    console.log("Initialisation réussie");

    await auth.connect();
    console.log("Connexion réussie");

    const userInfo = await auth.getUserInfo();
    console.log("Informations utilisateur:", userInfo);

    const accounts = await auth.getAccounts();
    console.log("Comptes:", accounts);

    const balance = await auth.getBalance();
    console.log("Solde:", balance);

    await auth.logout();
    console.log("Déconnexion réussie");
  } catch (error) {
    console.error("Erreur lors du test d'authentification:", error);
  }
}

// Exporter la classe Auth et la fonction de test
export { Auth, testAuth };
