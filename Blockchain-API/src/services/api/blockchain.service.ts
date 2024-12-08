import * as crypto from 'crypto';
import {ShymkivBlockchain} from "../blockchain-shymkiv.service";

export class BlockchainService {
    public blockchain: ShymkivBlockchain;
    private nodeIdentifier: string;

    constructor() {
        this.blockchain = new ShymkivBlockchain();
        this.nodeIdentifier = crypto.randomBytes(16).toString('hex'); // Унікальний ідентифікатор вузла
    }

    // Майнінг нового блоку
    mineBlock() {
        const lastBlock = this.blockchain.chain[this.blockchain.chain.length - 1];

        // Передаємо весь блок замість nonce
        const proof = this.blockchain.proofOfWork(lastBlock); // Передача останнього блоку

        // Нагороджуємо майнера
        this.blockchain.newTransaction("0", this.nodeIdentifier, this.blockchain.reward);

        // Створюємо новий блок
        const previousHash = ShymkivBlockchain.hash(lastBlock);
        const newBlock = this.blockchain.newBlock(previousHash);

        // Записуємо знайдене значення nonce у новий блок
        newBlock.nonce = proof.finalNonce; // Додаємо знайдений nonce


        // Отримуємо стан балансу та мемпулу
        const balances = this.blockchain.getBalances();
        const mempool = this.blockchain["_currentTransactions"]; // Отримуємо поточні транзакції

        return {
            message: "New Block Forged",
            index: newBlock.index,
            transactions: newBlock.transactions,
            proof: newBlock.nonce,
            previous_hash: newBlock.previousHash,
            balances,
            mempool,
        };
    }

    // Додавання нової транзакції
    addTransaction(sender: string, recipient: string, amount: number) {
        const index = this.blockchain.newTransaction(sender, recipient, amount);
        return `Transaction will be added to Block ${index}`;
    }

    // Отримання всього блокчейну
    getChain() {
        return {
            chain: this.blockchain.chain,
            length: this.blockchain.chain.length,
        };
    }
}
