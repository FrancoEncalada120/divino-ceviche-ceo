import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-invoice-table',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.scss',
})
export class InvoiceTableComponent<T extends any> {
  @Input() items: T[] = [];

  /** Solo para mostrar en el template (si quieres usarlo en logs/analytics) */
  @Input() tabKey: number | string | null = null;

  /** Emite el item completo */
  @Output() edit = new EventEmitter<T>();
  @Output() remove = new EventEmitter<T>();

  onEdit(item: T) {
    this.edit.emit(item);
  }

  onRemove(item: T) {
    this.remove.emit(item);
  }
}
