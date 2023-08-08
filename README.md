# Twi Social Network 🚀

Welcome to the Twi Social Network, the meme-tastic, crypto-charged, censorship-resistant social platform that's all about freedom, fun, and the mighty power of Web3!

## Demo

Website Demo: https://twi.dappykit.org/

Linea Goerli smart contract: https://explorer.goerli.linea.build/address/0xB174817cc2619a2829e59EE12B0666647C29c855/read-contract#address-tabs.
(here, you can verify that you've truly subscribed without using any gas)

![Example of Meme Wallet](img/meme-wallet-example.jpg)

## What's the Twi Difference? 🎯

Twi isn't your grandma's social network. It's a fully-fledged, decentralized playground where:

- You can log in with memes and Metamask. Yes, you read that right. We think email-password pairs are so 2000-late. We're all about the memes! 🐸
- Building social connections doesn't cost a penny, or even an Ether. Got 0 ETH on your balance? No worries, we've got you covered with gasless transactions. No pay-to-play here!
- Your content lives on a decentralized file system. Why? Because you should be the boss of your own data, that's why. No centralized servers or sneaky third parties getting their mitts on your stuff.

## Your Network, Your Rules 👑

What's more? At Twi, we understand that your social connections are priceless. That's why we've baked them right into the smart contract. No more worrying about losing your followers if your account gets blocked for some mysterious reason. Your subs are yours, forever, enshrined in the immutable ledger of the blockchain. Pretty neat, huh?

## Under the Hood 🧰

Twi is powered by a spectacular trio of decentralized technologies:

### [Mutable File System on Immutable Storages](https://github.com/FairJournal/file-system) 💽

We're running a mutable file system that plays nicely with a bunch of decentralized storage systems. From IPFS and TON Storage to Torrent, Arweave, and Swarm, we're all about giving you freedom and control. Each update to the file system is signed cryptographically and can be verified by the whole community. Plus, you can manage your data through public gateways without needing your own storage node.

### [Meme Ethereum Wallet](https://github.com/DappyKit/meme-wallet) 🖼️

Because we can't get enough of memes, we're also using the Meme Wallet library. This nifty tool stores encrypted Ethereum wallets inside images using steganography. It's a fun, experimental way to secure wallets with user passwords.

### [Mutable File System Gateway](https://github.com/FairJournal/backend) 🌐

Twi also uses a decentralized file system gateway. This gateway provides a public, uncensored file system that's accessible via the web for data sharing. It interfaces with multiple decentralized storage platforms, providing key services to manage data securely and effectively.

### [Social Connections](https://github.com/DappyKit/demo-contracts): The Friend-Making Revolution (Without Gas Fees!) 🎉

`SocialConnections.sol`, a smart contract that's all about letting you manage your social connections in a decentralized way. But that's not the best part. We've got Ethereum's EVM in one hand and the OpenGSN package in the other, making gasless transactions a reality. Yep, no more worrying about the price of gas when following your bestie! 🚗💨

Sure, here's the "How to Run the Project" section, written in markdown format:

## How to Run the Project 🏃‍♀️

Want to see the magic happen on your local machine? Just follow these steps:

1. **Clone the repo**: Run `git clone https://github.com/DappyKit/demo-twi.git` in your terminal to get your own copy of our code.

2. **Navigate to the app**: Use the command `cd app` to enter the main app directory.

3. **Install the dependencies**: Run `npm ci` to install all the necessary bits and bobs that our app needs to function.

4. **Set up your environment**: Copy the example environment file with `cp example.env .env`. This will create a new file where you can store all your secret keys and settings.

5. **Replace in your .env file**: Replace the following lines to your new .env file:
    ```
    REACT_APP_RELAY_URL=https://api.defender.openzeppelin.com/autotasks/f31e2140-89e1-4c85-95c6-8fd26b1bb985/runs/webhook/02d6ee21-bc63-415d-9ff6-b21ce038659c/QqJQSQyxeZ6P5CzKDDcc76
    REACT_APP_PROVIDER_URL=https://linea-goerli.infura.io/v3/YOUR_KEY
    REACT_APP_CHAIN_ID=59140
    REACT_APP_NETWORK_NAME="Linea Goerli"
    ```
   Don't forget to replace `YOUR_KEY` with your own Infura key!

6. **Start the party**: Finally, run `npm run start` to launch the app. It's showtime! 🎉

And that's it! You've just set up the Twi demo on your local machine. Have fun exploring!

## Grab the Wallet, Get the Prize! 🎁

Check out the attached Meme Wallet image at the top of the page. Looks cool, right? But what if we told you it's not just an image? Inside this picture is an Ethereum wallet with 10 shiny dollars sitting in it, waiting for a new owner. And that owner could be you! If you're the first one to decrypt the wallet using our tech, those funds are all yours to keep.

Oh, and did we mention it's on one of the EVM blockchains? Guess which one! Here's a little hint: it's not Ethereum. 😉

You can check out the wallet's balance right here: 0xeaD5A060A22aD612E8fda89F836A37D223e2ee3f. Password for the wallet is 111111.

So what are you waiting for? Get your code cracking and claim your prize! After all, who doesn't like a little crypto treasure hunt? 🕵️‍♀️💰