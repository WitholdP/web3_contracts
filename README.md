# My WEB3 contracts

This is a repository with my web3 contracts:
- Lottery contract - simple contract for an Item Lottery. Users can sign up for a lottery and owner of the contract can resolve it. If the requested amount of people signed up for the Lottery winner will be picked up. If not, then funds will be returned to users.

## Setting up the project


### Installation

1. run `git clone git@github.com:WitholdP/web3_contracts.git`
2. run `cd web3_contracts`
3. run `npm install`
4. Create `.env` file just by using default template values `cp .env.template .env`
5. Fill out the variables

## Starting up

In the project directory, you can run:

- run `npm run node` - to start local hardhat environment
- run `npm run compile` - to compile your contract
- run `npm run test` - to test Lottery contract. All of its features have tests written
- run `npm run lotteryScript` - to run a lotteryFactoryScripts. There are bunch of functions to play arround with contract already written down. They might not be the most efficient, but can give you an overview how everything is done.

Enjoy!
