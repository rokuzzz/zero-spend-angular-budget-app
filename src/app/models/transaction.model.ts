export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  SAVINGS = 'savings',
}

export interface Transaction {
  amount: number;
  type: TransactionType;
  title: string;
  date?: Date;
}
