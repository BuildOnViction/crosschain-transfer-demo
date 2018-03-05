This repository contains all source code of Tomo Testnet Infastructure. There are some main components in this repository including RewardEngine/CashIn/CashOut Smart Contracts, Tomochain and a litle bit TomoBackend/TomoWallet.

In the testnet, Users is able to get some Tomocoins by using Reward Engine, transfer Tomocoin from Tomochain to Rinkeby (CashOut) and transfer Tomocoin from Rinkeby to Tomochain (CashIn).

## Architecture Overview
There are two Blockchain is Tomo Testnet Infrastructure. The first one is Rinkeby, the second one is Tomochain. TomoBackend will handle Smart Contracts on both chains and requests from TomoWallet. Users will interact with the system via TomoWallet.

## Smart Contarcts
- RewardEngine
- CashIn
- CashOut

