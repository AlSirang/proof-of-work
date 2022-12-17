const SHA256 = require("crypto-js/sha256");
const TARGET_DIFFICULTY =
  BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
  mempool.push(transaction);
}

function mine() {
  const blockHeight = blocks.length;
  const mempoolLength = mempool.length;
  const txToInclude =
    mempoolLength > MAX_TRANSACTIONS ? MAX_TRANSACTIONS : mempoolLength;
  const transactions = [];
  for (let i = 0; i < txToInclude; i++) {
    transactions.push(mempool.shift());
  }

  const block = {
    id: blockHeight,
    transactions,
    nonce: 0,
  };

  let blockHash;
  while (true) {
    const currentHash = SHA256(JSON.stringify(block));
    const currentDifficulity = BigInt(`0x${currentHash}`);

    if (currentDifficulity < TARGET_DIFFICULTY) {
      blockHash = currentHash;
      break;
    }

    block.nonce += 1;
  }

  block.hash = blockHash;

  blocks.push(block);
}

module.exports = {
  TARGET_DIFFICULTY,
  MAX_TRANSACTIONS,
  addTransaction,
  mine,
  blocks,
  mempool,
};
