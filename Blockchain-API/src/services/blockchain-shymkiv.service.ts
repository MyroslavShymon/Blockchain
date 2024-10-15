import * as crypto from 'crypto';
import { constants, IBlock, ITransaction, ProofOfWorkResult } from "../core";

export class ShymkivBlockchain {
    public chain: IBlock[] = [];
    public reward: number = Number(constants.YYYY); // Початкова винагорода
    private _currentTransactions: ITransaction[] = [];
    private _maxNonce: number = Number(constants.MM + constants.YYYY);
    private _startingNonce: number = Number(constants.DD + constants.MM);
    private _surname: string = constants.SN;
    private _blockCount: number = 0; // Лічильник блоків

    constructor() {
        this.newGenesisBlock(this._surname);
    }

    // Метод для додавання нової транзакції
    newTransaction(sender: string, recipient: string, amount: number): number {
        this._currentTransactions.push({ sender, recipient, amount });
        return this.chain.length;
    }

    newGenesisBlock(previousHash: string): IBlock {
        return this.newBlock(previousHash);
    }

    // Метод для створення нового блоку
    newBlock(previousHash?: string): IBlock {
        const transactions = [...this._currentTransactions]; // Копіюємо поточні транзакції

        // Додаємо Coinbase-транзакцію перед іншими транзакціями
        const coinbaseTx = this.createCoinbaseTransaction();
        transactions.unshift(coinbaseTx);

        const newBlock = this.createBlock(this.chain.length, transactions, previousHash || this.getLastHash()); // Створюємо новий блок
        const { finalNonce, finalHash } = this.proofOfWork(newBlock); // Виконуємо алгоритм PoW для знаходження nonce

        this._currentTransactions = []; // Очищаємо поточні транзакції після створення блоку
        this.chain.push(newBlock);

        console.log(`Новий блок з індексом ${newBlock.index} додано з Nonce: ${finalNonce}, Hash: ${finalHash}`);
        console.log(`Nonce: ${finalNonce}`);

        // Оновлюємо винагороду кожні два блоки
        this._blockCount++;
        if (this._blockCount % 2 === 0) {
            this.reward = this.reward / (Number(constants.MM) + 1);
        }

        return newBlock;
    }

    // Метод для створення Coinbase-транзакції
    private createCoinbaseTransaction(): ITransaction {
        return {
            sender: "Coinbase",
            recipient: this._surname, // Винагорода йде майнеру (моє прізвище)
            amount: this.reward // Поточна винагорода
        };
    }

    // Метод для отримання останнього хеша
    getLastHash(): string {
        return ShymkivBlockchain.hash(this.chain[this.chain.length - 1]); // Хеш останнього блоку
    }

    // Статичний метод для хешування блоку
    static hash(block: IBlock): string {
        const blockString = `${block.index}${block.timestamp}${block.nonce}${block.previousHash}`; // Формування рядка для хешування
        return crypto.createHash('sha256').update(blockString).digest('hex'); // Хешування за допомогою SHA-256
    }

    // Створення блоку
    private createBlock(index: number, transactions: ITransaction[], previousHash: string): IBlock {
        return {
            index,
            timestamp: Date.now(),
            transactions,
            nonce: 0, // Початкове значення Nonce
            previousHash,
        };
    }

    // Алгоритм proof-of-work для знаходження nonce
    public proofOfWork(block: IBlock): ProofOfWorkResult {
        const isEvenSurname = this._surname.length % 2 === 0; // Перевірка, чи кількість літер у прізвищі парна
        let nonce = this._startingNonce; // Початкове значення Nonce
        let finalHash: string; // Хеш блоку з поточним Nonce
        let proofOfWorkIterations = 0;

        // Цикл для знаходження правильного значення Nonce
        do {
            nonce = isEvenSurname
                ? nonce + 1
                : Math.floor(Math.random() * (this._maxNonce - this._startingNonce)) + this._startingNonce;

            finalHash = ShymkivBlockchain.hash({ ...block, nonce }); // Хеш блоку з новим Nonce
            proofOfWorkIterations++;

            // Перевірка на перевищення максимального значення Nonce
            if (nonce > this._maxNonce) {
                throw new Error("Досягнуто максимального значення Nonce");
            }
        } while (!finalHash.endsWith(constants.MM)); // Перевірка наявності MM в кінці хешу

        block.nonce = nonce; // Записуємо знайдене значення Nonce в блок
        console.log(`Кількість ітерацій PoW: ${proofOfWorkIterations}`);
        return { finalNonce: nonce, finalHash };
    }
}