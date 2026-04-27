import { DecimalPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { Compra } from '../../../../core/models/compra.model';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchase-list',
  imports: [TableModule, TabViewModule, TxtsignoPipe, ButtonModule, NgIf],
  providers: [
    DecimalPipe
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {

  @Input()
  compraDetalle: CompraDetalle[] = [];

  @Output() delete = new EventEmitter<Compra>();

  expandedRows: any = {};

  onDelete(comp: Compra) {
    this.delete.emit(comp);
  }

  exportToExcel() {
    if (!this.compraDetalle || this.compraDetalle.length === 0) return;

    // Mapear data a columnas planas en inglés
    const dataToExport = this.compraDetalle.map(row => ({
      "Id": row.compra_id,
      "Reference Id": row.compra!.referencia_id || "---",
      "Date": row.compra!.fecha,
      "Item": row.insumo!.nombreCompleto,
      "Quantity": row.cantidad,
      "Price": row.precio,
      "Total": row.total,
      "User": `${row.compra!.created_user?.user_name || ''} ${row.compra!.created_user?.user_apellido || ''}`,
      "Notes": row.compra!.detalle || "---"
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Purchase List");
    XLSX.writeFile(wb, "purchase-list.xlsx");
  }


  onRowExpand(event: TableRowExpandEvent) {
    this.expandedRows = {
      [event.data.compra_order_id]: true
    };
  }
  onRowCollapse(event: TableRowCollapseEvent) {
    this.expandedRows = {};
  }

}
