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
 *
 */
export default class CustomWallet {
  private data: IData;
  private functions: IFunctions;

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

  public handleApproveTransaction(approveTransaction: (txData: Tx) => Promise<boolean>) {
    this.functions.approveTransaction = approveTransaction;
    return this;
  }

  public handleGetAccounts(getAccounts: () => Promise<string[]>) {
    this.functions.getAccounts = getAccounts;
    return this;
  }

  public handleSignTransaction(signTransaction: (txData: Tx) => Promise<string>) {
    this.functions.signTransaction = signTransaction;
    return this;
  }
}
