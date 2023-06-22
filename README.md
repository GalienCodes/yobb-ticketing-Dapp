# Yob-Ticketing
![My Imagez](https://i.ibb.co/yPwBywY/Screenshot-from-2023-06-22-16-21-42.png)
## Description
Yob a revolutionary ticket booking Dapp that leverages blockchain technology to offer secure, fast, and decentralized transactions for online ticket bookings. By utilizing Non-Fungible Tokens (NFTs) with auto-generated QR codes, Yob ensures the authenticity and uniqueness of each ticket.

With Yob, users can easily browse and explore a wide range of events and conveniently purchase tickets directly through the smart contract. All transactions are recorded on the blockchain, providing transparency and immutability. This eliminates the need for intermediaries, reducing costs and streamlining the ticketing process.

Event organizers can effortlessly add event details such as ticket prices and the number of available tickets. Yob empowers organizers with a user-friendly interface to manage their events, ensuring accurate tracking and efficient ticket distribution.

In addition, Yob integrates with Celo Explore, allowing users to view the minted NFT tickets and verify their authenticity. This further enhances trust and security in the ticketing ecosystem.

The purpose of this Yob is to provide a platform for the sale and purchase of event tickets, Users can purchase tickets for events through the smart contract and their purchases will be recorded and tracked.

### Click on the link below for live demo
[Live Youtube demo](https://youtu.be/_IWWrk6qNbc)

## Tech Stack
This Dapp uses the following tech stack:

- `Nextjs` :  React framework that gives you building blocks to create web application
- `Web3Modal`:  is an elegantly simple yet powerful library that helps you manage your multi-chain wallet connection flows, all in one place.
- `Hardhat` - A tool for writing and deploying smart contracts.
- `Tailwind CSS`: is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.
- `Axios` - A promise-based HTTP client for node.js. Used to send requests to pinata api.
- `QRcode` - QRcode generator.
 
## Prerequisite
1. Install the Coinbase wallet/ celo wallet
2. Create a wallet.
3. Get some [Celo Faucet](https://faucet.celo.org/alfajores) and get tokens for the alfajores testnet.

## Getting Started

First, Clone the repo:
```bash 
git ccone https://github.com/Muhindo-Galien/Yob-Ticketing-dapp
```

Then,run the development server:

```bash

npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Site Overview
## Client side
When we open a site we will see a white screen and wallet authorization window.
![My Image3](https://i.ibb.co/48PmjW6/Screenshot-from-2023-06-22-16-14-18.png)
After successful authorization, we see the home page. On the menu, there are "My tickets" (where all the tickets that the current user owns) and "About page" (Where there's a little description about the Dapp).
![My Image](https://i.ibb.co/CBmLx3N/Screenshot-from-2023-06-22-15-14-45.png)
![My Image2](https://i.ibb.co/r23mDgZ/Screenshot-from-2023-06-22-15-15-07.png)
After clicking on any listed event we are redirected to the event details page. All information about the event will be displayed in a detailed way, and there will be two columns, 1 for all **silver** tickets and the other one for all **VIP** tickets with each a button to buy a ticket if available or on sale.

![My Image3](https://i.ibb.co/TW55sHf/Screenshot-from-2023-06-19-23-40-54.png)
To purchase a ticket, we click on "Buy Now" and after a successful purchase, you'll be redirected to my tickets page where all tickets that the current user owns are displayed
![My Image3](https://i.ibb.co/xJsq2gP/Screenshot-from-2023-06-22-16-13-58.png)

Also, client can mint ticket qr code as NFT by clicking on the "Mint Ticket NFT" button.
NFT view on the CELO explorer:
![celo explorer](https://i.ibb.co/mXkzbDk/Screenshot-from-2023-06-22-16-46-12.png)

Client can watch ticket QR code by clicking on the "Watch QR code" button.
![Ticket QR_code](https://i.ibb.co/zFBX5H3/Screenshot-from-2023-06-22-18-34-05.png)
After scanning qr code, ticket info page will open.
###NOTE: Only owner  that scans a qr code of a ticket and opens ticket information page.
![Ticket info](https://i.ibb.co/G0V4gnq/Screenshot-from-2023-06-22-15-14-26.png)

### Thank you
