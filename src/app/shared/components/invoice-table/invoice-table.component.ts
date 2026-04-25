import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';

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

  exportExcel() {
    const rows = (this.items as any[]).map((item) => ({
      Date: item.invoice_date,
      Vendor: item.invoice_vendor_description,
      Category: item.category?.category_code ?? '',
      Amount: item.invoice_amount,
      Notes: item.invoice_notes ?? '',
      Location: item.locations?.location_name ?? '',
      User: item.created_user?.user_name ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    XLSX.writeFile(wb, 'invoices.xlsx');
  }
}
