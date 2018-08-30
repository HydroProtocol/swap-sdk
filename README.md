# Javascript SDK for Hydro Swap

Provides more advanced integration for the Hydro Swap widget when a simple script tag embed is not enough.

## What is Hydro Swap?

Hydro Swap allows for easy conversion between ETH and ERC20 tokens. The Hydro Swap API will calculate a current market price for an ERC20 token and allow you to exchange ETH/tokens at that price point. The price point is fluid and the offer is only valid for a set period of time. Because of that, you must interact with the Hydro Swap API to create and sign an order validating the amount of token and price. Once you have the signed transaction data it can be passed to this contract to complete the transaction.

For more information, please visit https://swap.hydroprotocol.io/

## What is this SDK for?

The SDK is meant to help you construct and embed the Swap Widget if you would like more advanced functionality, such as the ability to implement a custom wallet.
