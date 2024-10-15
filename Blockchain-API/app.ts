import express from 'express';
import bodyParser from 'body-parser';
import {ShymkivBlockchain} from "./src/services";
import {constants} from "./src/core";
import {addTransaction, getChain, mineBlock} from "./src/controllers";

const app = express();
app.use(bodyParser.json()); // Для обробки JSON-запитів

// Кінцеві точки API
app.get('/mine', mineBlock);
app.post('/transactions/new', addTransaction);
app.get('/chain', getChain);

// Запуск сервера
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    // Створення та використання блокчейну
    const blockchain = new ShymkivBlockchain();

// Кількість блоків для майнінгу — ((DD + 1) mod 13)
    const blocksToMine = (Number(constants.DD) + 1) % 13;

    for (let i = 0; i < blocksToMine; i++) {
        blockchain.newTransaction(`Sender ${i + 1}`, `Recipient ${i + 2}`, i * 10); // Створюємо транзакції
        blockchain.newBlock(); // Майнінг блоку
    }

    console.log("---------Виведення інформації про блоки та транзакції---------\n");

    blockchain.chain.forEach((block) => {
        console.log(`Block with index: ${block.index}, nonce: ${block.nonce}, previousHash: ${block.previousHash}, timestamp: ${block.timestamp}`);
        block.transactions.forEach((tx) => {
            console.log(`Sender: ${tx.sender}, Recipient: ${tx.recipient}, Amount: ${tx.amount}`);
        });
        console.log();
    });
});