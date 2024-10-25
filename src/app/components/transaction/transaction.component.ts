import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TransactionType, Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './transaction.component.html',
})
export class TransactionComponent {
  @Input() transactionType!: TransactionType;
  @Output() onTransactionAdded = new EventEmitter<Transaction>();

  form = this._formBuilder.group({
    amount: [null, [Validators.required, Validators.min(0.01)]], // Changed from '' to null
    title: [null, [Validators.required]], // Changed from '' to null
  });

  constructor(private _formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      const transaction: Transaction = {
        amount: Number(this.form.value.amount),
        title: this.form.value.title || '',
        type: this.transactionType,
        date: new Date(),
      };

      this.onTransactionAdded.emit(transaction);

      // Simple reset
      this.form.reset({
        amount: null,
        title: null,
      });
    }
  }

  getErrorMessage(fieldName: 'amount' | 'title'): string {
    const control = this.form.get(fieldName);

    if (!control) return '';

    if (control.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }

    if (fieldName === 'amount' && control.hasError('min')) {
      return 'Amount must be greater than 0';
    }

    return '';
  }
}
