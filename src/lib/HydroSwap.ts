import Penpal from "penpal";

type Wallet = "metamask" | "ledger" | "custom";

/**
 *
 */
export class HydroSwap {
  private static BASE_URL: string = "https://widget.hydroprotocol.io";

  private id: string;

  private defaultAmount?: number;
  private defaultWallet?: Wallet;
  private wallets?: Wallet[];

  private sign?: (message: string) => Promise<string>;
  private getAddress?: () => Promise<string>;

  constructor(id: string) {
    this.id = id;
  }

  public attach(container: HTMLElement) {
    let url = new URL(this.id, HydroSwap.BASE_URL);
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
          sign: async (message: string) => {
            if (!this.sign) {
              throw new Error(
                "If requesting a custom wallet, you must define a sign handler"
              );
            }
            return await this.sign(message);
          },
          getAddress: async () => {
            if (!this.getAddress) {
              throw new Error(
                "If requesting a custom wallet, you must define a getAddress handler"
              );
            }
            return await this.getAddress();
          }
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

  public handleSign(sign: (message: string) => Promise<string>) {
    this.sign = sign;
    return this;
  }

  public handleGetAddress(getAddress: () => Promise<string>) {
    this.getAddress = getAddress;
    return this;
  }
}
