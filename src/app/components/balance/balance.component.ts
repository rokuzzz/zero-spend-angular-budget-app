import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class BalanceComponent {
  @Input() currentBalance: number = 0;
  @Input() savingsAmount: number = 0;
}
