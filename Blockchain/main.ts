import {ShymkivBlockchain} from "./blockchain";

// Створення та використання блокчейну
const blockchain = new ShymkivBlockchain();

blockchain.newTransaction("Sender 1", "Sender 2", 21);
blockchain.newTransaction("Sender 1", "Sender 2", 457);
blockchain.newTransaction("Sender 1", "Sender 2", 2);

blockchain.newBlock();

blockchain.newTransaction("Sender 3", "Sender 4", 81);

blockchain.newBlock();

console.log("---------Виведення інформації про блоки та транзакції---------\n");

// Виведення інформації про блоки та транзакції
blockchain.chain.forEach((block) => {
    console.log(`Block with index: ${block.index}, nonce: ${block.nonce}, previousHash: ${block.previousHash}, timestamp: ${block.timestamp}`);
    block.transactions.forEach((tx) => {
        console.log(`Sender: ${tx.sender}, Recipient: ${tx.recipient}, Amount: ${tx.amount}`);
    });
    console.log();
});
