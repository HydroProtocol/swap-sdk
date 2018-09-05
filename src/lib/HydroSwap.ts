import Penpal from "penpal";
import { Tx } from "web3/eth/types";
import CustomWallet from "./CustomWallet";

type Network = "main" | "ropsten" | "local";
type Wallet = "metamask" | "ledger" | "custom";

/**
 *
 */
export default class HydroSwap {
  private id: string;
  private network: Network;

  private defaultAmount?: number;
  private defaultWallet?: Wallet;
  private wallets?: Wallet[];

  private customWallet?: CustomWallet;

  constructor(id: string, network?: Network) {
    this.id = id;
    this.network = network || "main";
  }

  public attach(container: HTMLElement) {
    let url = new URL(this.id, this.getBaseURL());
    let params = new URLSearchParams();
    if (this.defaultAmount) {
      params.append("amount", this.defaultAmount.toFixed(2));
    }
    if (this.defaultWallet) {
      params.append("defaultWallet", this.defaultWallet);
    }
    if (this.wallets) {
      params.append("wallets", this.wallets.join(","));
    }
    url.search = params.toString();

    const rounded = document.createElement("div");
    rounded.style.background = "white";
    rounded.style.borderRadius = "5px";
    rounded.style.height = "465px";
    rounded.style.width = "488px";
    rounded.style.overflow = "hidden";
    container.appendChild(rounded);

    let frame;
    if (this.wallets && this.wallets.indexOf("custom") >= 0) {
      frame = Penpal.connectToChild({
        url: url.href,
        appendTo: rounded,
        methods: {
          approveTransaction: (txData: Tx): Promise<boolean> =>
            this.getCustomWallet().approveTransaction(txData),
          getAccounts: (): Promise<string[]> =>
            this.getCustomWallet().getAccounts(),
          signTransaction: (txData: Tx): Promise<string> =>
            this.getCustomWallet().signTransaction(txData),
          getIconURL: (): string => this.getCustomWallet().iconURL,
          getName: (): string => this.getCustomWallet().name
        }
      }).iframe;
    } else {
      frame = document.createElement("iframe");
      frame.src = url.href;
    }

    frame.scrolling = "no";
    frame.style.border = "0";
    frame.style.height = frame.style.width = "100%";
  }

  public setDefaultAmount(amount: number) {
    this.defaultAmount = amount;
    return this;
  }

  public setDefaultWallet(wallet: Wallet) {
    this.defaultWallet = wallet;
    return this;
  }

  public setWallets(wallets: Wallet[]) {
    this.wallets = wallets;
    return this;
  }

  public setCustomWallet(customWallet: CustomWallet) {
    this.customWallet = customWallet;
    return this;
  }

  private getCustomWallet(): CustomWallet {
    if (!this.customWallet) {
      throw new Error("Custom wallet handler must be defined.");
    }
    return this.customWallet;
  }

  private getBaseURL(): string {
    switch (this.network) {
      case "main":
        return "https://widget.hydroprotocol.io";
      case "ropsten":
        return "https://widget-ropsten.hydroprotocol.io";
      case "local":
        return "https://localhost:4000";
    }
  }
}
