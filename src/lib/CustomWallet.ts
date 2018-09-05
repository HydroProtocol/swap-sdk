interface IData {
  name: string;
  iconURL?: string;
}

interface IFunctions {
  signTransaction?: (txData: any) => Promise<any>;
  getAccounts?: () => Promise<string[]>;
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

  public signTransaction(txData: any): Promise<any> {
    if (!this.functions.signTransaction) {
      throw new Error(
        "If requesting a custom wallet, you must define a signTransaction handler"
      );
    }
    return this.functions.signTransaction(txData);
  }

  public getAccounts(): Promise<string[]> {
    if (!this.functions.getAccounts) {
      throw new Error(
        "If requesting a custom wallet, you must define a getAccounts handler"
      );
    }
    return this.functions.getAccounts();
  }

  public handleSignTransaction(signTransaction: (txData: any) => Promise<any>) {
    this.functions.signTransaction = signTransaction;
    return this;
  }

  public handleGetAccounts(getAccounts: () => Promise<string[]>) {
    this.functions.getAccounts = getAccounts;
    return this;
  }
}
