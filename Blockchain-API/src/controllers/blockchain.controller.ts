import { Request, Response } from 'express';
import { BlockchainService } from '../services';

const blockchainService = new BlockchainService();

// Майнінг нового блоку
export const mineBlock = (req: Request, res: Response) => {
    try {
        const result = blockchainService.mineBlock();
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message }) as any;
    }
};

//Виведення стану балансу
export const getBalances = (req: Request, res: Response) => {
    const balances = blockchainService.blockchain.getBalances();
    return res.status(200).json(balances) as any;
};

// Отримання стану мемпулу
export const getMempool = (req: Request, res: Response) => {
    const mempool = blockchainService.blockchain["_currentTransactions"]; // Поточні транзакції
    return res.status(200).json({ mempool }) as any;
};


// Додавання нової транзакції
export const addTransaction = (req: Request, res: Response) => {
    const { sender, recipient, amount } = req.body;

    // Перевірка наявності необхідних полів
    if (!sender || !recipient || !amount) {
        return res.status(400).json({ message: 'Missing values' }) as any;
    }

    // Додавання нової транзакції
    const message = blockchainService.addTransaction(sender, recipient, amount);
    return res.status(201).json({ message });
};

// Отримання всього блокчейну
export const getChain = (req: Request, res: Response) => {
    const result = blockchainService.getChain();
    return res.status(200).json(result) as any;
};