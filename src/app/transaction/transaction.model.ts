export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export interface Transaction {
  amount: number;
  type: TransactionType;
  title: string;
}