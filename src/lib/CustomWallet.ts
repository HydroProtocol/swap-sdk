import { Tx } from "web3/eth/types";

interface IData {
  name: string;
  iconURL?: string;
}

interface IFunctions {
  approveTransaction?: (txData: Tx) => Promise<boolean>;
  getAccounts?: () => Promise<string[]>;
  signTransaction?: (txData: Tx) => Promise<string>;
}

/**
 * A handler for a custom wallet definition.
 */
export default class CustomWallet {
  private data: IData;
  private functions: IFunctions;

  /**
   * @param name The name of your wallet in the dropdown.
   * @param iconURL URL of an icon for the dropdown.
   *   Can be anything that would go into an img tag as src, e.g. url or data:image.
   */
  constructor(name: string, iconURL?: string) {
    this.data = {
      name,
      iconURL
    };
    this.functions = {};
  }

  public get name(): string {
    return this.data.name;
  }

  public get iconURL(): string {
    return this.data.iconURL || "";
  }

  public approveTransaction(txData: Tx): Promise<boolean> {
    if (!this.functions.approveTransaction) {
      throw new Error(
        "If requesting a custom wallet, you must define a approveTransaction handler"
      );
    }
    return this.functions.approveTransaction(txData);
  }

  public getAccounts(): Promise<string[]> {
    if (!this.functions.getAccounts) {
      throw new Error(
        "If requesting a custom wallet, you must define a getAccounts handler"
      );
    }
    return this.functions.getAccounts();
  }

  public signTransaction(txData: Tx): Promise<string> {
    console.log(txData);
    if (!this.functions.signTransaction) {
      throw new Error(
        "If requesting a custom wallet, you must define a signTransaction handler"
      );
    }
    return this.functions.signTransaction(txData);
  }

  /**
   * A handler for approving a transaction.
   * @param approveTransaction A function which takes in web3 transaction data and returns a promise.
   *   The promise should resolve to true if the transaction is approved, and false otherwise.
   */
  public handleApproveTransaction(
    approveTransaction: (txData: Tx) => Promise<boolean>
  ) {
    this.functions.approveTransaction = approveTransaction;
    return this;
  }

  /**
   * A handler for getting account addresses associated with this wallet
   * @param getAccounts A function that returns a promise. The promise should resolve to an array of addresses.
   */
  public handleGetAccounts(getAccounts: () => Promise<string[]>) {
    this.functions.getAccounts = getAccounts;
    return this;
  }

  /**
   * A handler for signing transaction data
   * @param signTransaction A function which takes in web3 transaction data and returns a promise.
   *   The promise should resolve to a string representing the signed transaction data in hex format.
   */
  public handleSignTransaction(
    signTransaction: (txData: Tx) => Promise<string>
  ) {
    this.functions.signTransaction = signTransaction;
    return this;
  }
}
