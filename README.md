# Javascript SDK for Hydro Swap

Provides more advanced integration for the Hydro Swap widget when a simple script tag embed is not enough.

## What is Hydro Swap?

Hydro Swap allows for easy conversion between ETH and ERC20 tokens. The Hydro Swap API will calculate a current market price for an ERC20 token and allow you to exchange ETH/tokens at that price point. The price point is fluid and the offer is only valid for a set period of time. Because of that, you must interact with the Hydro Swap API to create and sign an order validating the amount of token and price. Once you have the signed transaction data it can be passed to this contract to complete the transaction.

For more information, please visit https://swap.hydroprotocol.io/

## What is this SDK for?

The SDK is meant to help you construct and embed the Swap Widget if you would like more advanced functionality, such as the ability to implement a custom wallet.

## Getting started

To get started, simply install the package through npm:

`npm i @hydro-protocol/swap-sdk`

Once you've done that you can begin customizing your widget.

### HydroSwap

The HydroSwap class is the main interface for customizing your widget. You can use it as follows:

```javascript
import HydroSwap from "@hydro-protocol/swap-sdk";

const sdk = new HydroSwap("<id>");
```

The ID you use will be assigned to you when you create your Hydro Swap account and set up your market.

Once you have the SDK, you can set various properties for the widget. These calls are chainable.

`setDefaultAmount(amount: number)`

This sets the default amount that will be populated into the token field when the widget loads.

`setWallets(wallets: Wallet[])`

This sets a list of wallets that will be available via the wallet selection dropdown in the widget.
Currently acceptable wallets are "metamask", "ledger", and "custom".

`setDefaultWallet(wallet: Wallet)`

This sets which wallet in the dropdown will be selected by default on load.

`setCustomWallet(customWallet: CustomWallet)`

If you pass "custom" as one of your wallets in `setWallets`, you must define a handler for your
wallet in the form of a CustomWallet. See next section for details.

`attach(container: HTMLElement)`

Attaches the swap widget into your document, with the container as the parent element.

### CustomWallet

The CustomWallet class is used to define a handler for a custom wallet. You can use it as follows:

```javascript
import { CustomWallet } from "@hydro-protocol/swap-sdk";

const customWallet = new CustomWallet("Custom Wallet");
```

The custom wallet takes in multiple parameters in the constructor.

`constructor(name: string, iconURL?: string)`

You must define a name for your custom wallet, which will be displayed in the dropdown. If you don't
define an icon we will provide a default for you. If you'd like to define an icon, you must pass
a string as the second argument of the constructor. This string can be anything that would go into
an img tag as the src. e.g. a URL to a hosted image, or a data:image string.

Beyond the constructor, you must define 3 handlers for your wallet.

`handleGetAccounts(getAccounts: () => Promise<string[]>)`

This lets you define a function that will return a promise. The promise should resolve to a list
of account addresses that are handled by this wallet.

`handleApproveTransaction(approveTransaction: (txData: Tx) => Promise<boolean>)`

This lets you define a function that will take web3 transaction data and return a promise. It will
be called when you should decide if you want to allow the transaction to go through. Most commonly
you will provide some UI to the user who will then decide if they want to sign and send this transaction
to the blockchain. The promise should resolve to true if you want the transaction to proceed, and false
if not.

`handleSignTransaction(signTransaction: (txData: Tx) => Promise<string>)`

This lets you define a function that will take web3 transaction data and return a promise. The promise
should resolve to a string, which will be the raw signed transaction data in hex format.

### Example

A full example of how you might customize and insert the Hydro Swap widget.

```javascript
import HydroSwap, { CustomWallet } from "@hydro-protocol/swap-sdk";

const customWallet = new CustomWallet(
  "Custom Wallet",
  "https://example.com/custom_wallet.png"
)
  .handleApproveTransaction(async txData =>
    window.confirm("Approve transaction from: " + txData.from)
  )
  .handleGetAccounts(async () => [this.wallet.getAddress()])
  .handleSignTransaction(async txData => this.wallet.sign(txData));
const sdk = new HydroSwap("<id>")
  .setDefaultAmount(100)
  .setWallets(["metamask", "custom"])
  .setDefaultWallet("custom")
  .setCustomWallet(customWallet);
sdk.attach($("#hydro-swap-container"));
```
