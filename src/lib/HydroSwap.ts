import Penpal from "penpal";
import { Tx } from "web3/eth/types";
import CustomWallet from "./CustomWallet";

type Network = "main" | "ropsten" | "local";
type Wallet = "browser" | "ledger" | "custom";

/**
 * Main class for customizing the Hydro Swap widget, to be embedded into
 * your page.
 */
export default class HydroSwap {
  private id: string;
  private network: Network;

  private defaultAmount?: number;
  private defaultWallet?: Wallet;
  private wallets?: Wallet[];

  private customWallet?: CustomWallet;

  /**
   * @param id Your hydro swap id. This will define which market is used.
   * @param network Optional - Which network to attach to. Generally used for testing.
   */
  constructor(id: string, network?: Network) {
    this.id = id;
    this.network = network || "main";
  }

  /**
   * Attaches the Hydro Swap widget iframe to your document
   * @param container The container to add the widget as a child
   */
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

    const responsive = (query: MediaQueryList) => {
      if (query.matches) {
        rounded.style.width = "100%";
        rounded.style.height = "553px";
      } else {
        rounded.style.width = "488px";
        rounded.style.height = "465px";
      }
    };
    let q = window.matchMedia("(max-width: 487px)");
    responsive(q);
    q.addListener(responsive);
  }

  /**
   * The default amount of token that will be pre-populated into the widget
   * @param amount An amount of token, e.g. 100
   */
  public setDefaultAmount(amount: number) {
    this.defaultAmount = amount;
    return this;
  }

  /**
   * The default wallet that will be selected in the dropdown. If nothing is
   * specified, the first wallet from setWallets will be selected. If setWallets
   * is not defined, it will default to Browser.
   * @param wallet The default wallet to be selected
   */
  public setDefaultWallet(wallet: Wallet) {
    this.defaultWallet = wallet;
    return this;
  }

  /**
   * The list of wallets that will appear in the dropdown selector, in order
   * @param wallets List of wallets
   */
  public setWallets(wallets: Wallet[]) {
    this.wallets = wallets;
    return this;
  }

  /**
   * Handler for a custom wallet definition. If the wallets you set in setWallets
   * includes "custom", this handler must be defined.
   * @param customWallet A custom wallet handler
   */
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
