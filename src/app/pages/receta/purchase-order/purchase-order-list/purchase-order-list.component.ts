import { DecimalPipe, NgIf, NgForOf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { Compra } from '../../../../core/models/compra.model';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-purchase-order-list',
  imports: [TableModule, TabViewModule, TxtsignoPipe, ButtonModule, RippleModule, NgIf],
  providers: [
    DecimalPipe
  ],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.scss'
})
export class PurchaseOrderListComponent {

  @Input()
  compraDetalle: Compra[] = [];

  @Output() delete = new EventEmitter<Compra>();
  @Output() complete = new EventEmitter<Compra>();

  expandedRows: any = {};

  onDelete(comp: Compra) {
    this.delete.emit(comp);
  }

  onComplete(comp: Compra) {
    this.complete.emit(comp);
  }

  // mostrarBotones(row: CompraDetalle, rowIndex: number) {

  //   if (rowIndex - 1 < 0)
  //     return true;

  //   if (row.compra_order!.compra_order_estado == 1) {
  //     if (row.compra_order!.compra_order_id != this.compraDetalle[rowIndex - 1].compra_order_id)
  //       return true;

  //   }

  //   return false;

  // }

  exportToExcel() {
    if (!this.compraDetalle || this.compraDetalle.length === 0) return;

    // Mapear data a columnas planas en inglés
    const dataToExport = this.compraDetalle.flatMap(row =>
      row.order_detalles.map(i => ({
        "Id": row.compra_id,
        "Reference Id": row.referencia_id || "---",
        "Date": row.fecha,
        "Item": i.insumo?.nombreCompleto,
        "Quantity": i.cantidad,
        "Price": i.precio,
        "Total": row.total,
        "User": `${row.created_user?.user_name || ''} ${row.created_user?.user_apellido || ''}`,
        "Notes": row.detalle || "---"
      }))
    );

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
