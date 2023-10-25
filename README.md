# Angular Budget App

## Introduction

In this project, you'll create a budgeting application using Angular. This app will help users manage their incomes and expenses, track their balance, and save money by setting saving targets.

## Description

In the Budget App, users will be able to:

1. Record both incomes and expenses.
2. Check their balance.
3. Manage the saving:
   - Set a targeted saving amount.
   - Transfer money into or out of the saving account.
   - View their progress towards reaching the saving target.

## Prerequisites

Before starting on this project, ensure you've covered:

- Angular Philosophy and Architecture.
- Usage and commands in Angular CLI.
- Deep understanding of Components and Modules.
- Working with Templates and mastering Data Binding.

## Guidelines

1. Creating components:

- Use the Angular CLI to generate the main components for the app:

  ```
  ng generate component transaction
  ng generate component balance
  ng generate component saving
  ```

2. Inside the `transaction` directory, create a new file named `transaction.model.ts`. Create an interface for the transaction which should include `amount`, `type`, and `title`. `type` could be Enumerate type either 'income' or 'expense'.
3. `TransactionComponent`: This component can be reused for both Income and Expense entries.

   - Properties:
     - `transactionType`: Enumerate type either 'income' or 'expense'.
     - `@Output() onTransactionAdded`: Use the `@Output()` decorator to emit an event when a transaction is added.
     - `@Input() transactionType`: Accept an input to determine if it's handling an income or expense.
   - Methods:
     - `addTransaction(amount: number, title: string)`: Emit the transaction (type `Transation`) to the parent. _Hint:_ use the paramaters `amount` and `title`, and the input `transactionType` to create new transaction object. Transaction event can be emitted using syntax `this.onTransactionAdded.emit(newTransaction);`
   - In `transaction.component.html`, design a basic form to capture transaction details. Use the `transactionType` input to display the correct title (either "Income" or "Expense") on the form. Bind the form elements to the transaction attributes and include a button to submit the form.

4. `BalanceComponent`: Displays the current balance and provides options to transfer money to the saving account.

   - Properties:
     - `@Input() currentBalance`: A numeric property representing the available funds.
     - `@Output() onTransferToSaving`: an event to transfer money from balance to saving.
   - Methods:
     - `transferToSavings(amount: number)`: Emit the transfer to saving event. Make sure you don't allow the `currentBalance` to become negative.

5. `SavingsComponent`: Allows setting a saving target and displays a progress bar.

   - Properties:
     - `@Input() savingAmount`: Current amount saved.
     - `targetAmount`: Target saving amount.
     - `@Output() onTransferToSaving`: an event to transfer money from saving back to balance.
   - Methods:
     - `setTarget(amount: number)`: Set a new target saving amount.
     - `transferToBalance(amount: number)`: Emit the transfer to balance event. Make sure you don't allow the `savingAmount` to become negative.

6. `AppComponent`:

- Properties:
  - `savingAmount`: Current amount saved.
  - `currentBalance`: Current balance.
- Methods:
    - `handleAddTransaction(transaction: Transaction) `: This method updates the `currentBalance` when transaction is added in the `TransactionComponent`.
    - `handleTransferToBalance(amount: number)`: This method updates the `currentBalance` and `SavingAmount` when transafering money from saving back to balance in `SavingComponent`
    - `handleTransferToSaving(amount: number)`: This method updates the `currentBalance` and `SavingAmount` when transafering money from balance to saving in `BalanceComponent`.
- `app.component.html` example:
    ```
    <div class="container">
        <h1>Welcome to the Budget App</h1>

        <!-- Display the Balance -->
        <app-balance [currentBalance]="currentBalance"
                    (onTransferToSaving)="handleTransferToSaving($event)">
        </app-balance>

        <!-- Add Income and Expense -->
        <div class="transactions">
            <!-- Income Transaction -->
            <app-transaction (onTransactionAdded)="handleAddTransaction($event)"
                            [transactionType]="'income'">
            </app-transaction>

            <!-- Expense Transaction -->
            <app-transaction (onTransactionAdded)="handleAddTransaction($event)"
                            [transactionType]="'expense'">
            </app-transaction>
        </div>

        <!-- Manage and Display Savings -->
        <app-saving [savingAmount]="savingAmount"
                    (onTransferToBalance)="handleTransferToBalance($event)">
        </app-saving>
    </div>
    ```