#!/bin/bash

if [ ! -d /build/tomochain/geth/chaindata ]
then
  wallet=$(geth account new --password /build/.pwd --datadir /build/tomochain | awk -v FS="({|})" '{print $2}')
  sed -i "s/:wallet:/${wallet}/g" /build/tomochain.json
  geth --nodiscover --datadir /build/tomochain init tomochain.json
  geth --nodiscover --datadir /build/tomochain --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --unlock "${wallet}" --password /build/.pwd --mine
else
  wallet=$(geth account list --datadir /build/tomochain| head -n 1 | awk -v FS="({|})" '{print $2}')
  geth --nodiscover --datadir /build/tomochain --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --unlock "${wallet}" --password /build/.pwd --mine
fi
