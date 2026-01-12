import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-monthly-pl',
  imports: [CommonModule, FormsModule, DatePickerModule, MultiSelectModule],
  templateUrl: './monthly-pl.component.html',
  styleUrl: './monthly-pl.component.scss',
})
export class MonthlyPlComponent {}
