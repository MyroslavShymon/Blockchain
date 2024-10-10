import {ITransaction} from "./transaction.interface";

export interface IBlock {
    index: number;
    timestamp: number;
    transactions: ITransaction[];
    nonce: number;
    previousHash: string;
}