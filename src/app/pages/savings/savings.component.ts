import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { TransactionService } from '../../services/transaction.service';
import { SavingsGoal } from '../../models/transaction.model';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
  ],
  templateUrl: './savings.component.html',
})
export class SavingsComponent implements OnInit {
  savingsGoal: SavingsGoal | null = null;
  currentSavings = 0;
  progress = 0;

  form = this._formBuilder.group({
    amount: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d*\.?\d{0,2}$/),
      ],
    ],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.transactionService.savingsGoal$.subscribe((goal) => {
      this.savingsGoal = goal;
      this.updateProgress();
    });

    this.transactionService.transactions$.subscribe(() => {
      this.currentSavings = this.transactionService.calculateSavings();
      this.progress = this.transactionService.calculateSavingsProgress();
    });
  }

  updateProgress() {
    this.progress = this.transactionService.calculateSavingsProgress();
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const amount = this.form.get('amount')?.value;

    if (!amount) {
      return;
    }

    // Simplified - just pass the amount
    this.transactionService.setSavingsGoal(Number(amount));
    this.form.reset();
  }

  getErrorMessage(): string {
    const control = this.form.get('amount');

    if (!control) return '';

    if (control.hasError('required')) {
      return 'Amount is required';
    }

    if (control.hasError('min')) {
      return 'Amount must be greater than 0';
    }

    if (control.hasError('pattern')) {
      return 'Invalid amount';
    }

    return '';
  }
}
