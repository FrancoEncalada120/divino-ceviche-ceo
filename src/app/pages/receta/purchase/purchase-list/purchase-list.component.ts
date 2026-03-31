import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { Compra } from '../../../../core/models/compra.model';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';

@Component({
  selector: 'app-purchase-list',
  imports: [TableModule, TabViewModule, TxtsignoPipe, NgFor, NgIf],
  providers: [
    DecimalPipe
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {

  @Input()
  compraDetalle: CompraDetalle[] = [];

  @Output() edit = new EventEmitter<Compra>();
  @Output() delete = new EventEmitter<Compra>();

  onEdit(comp: Compra) {

    console.log('Editando compra:', comp);
    this.edit.emit(comp);
  }

  onDelete(comp: Compra) {
    this.delete.emit(comp);
  }

  expandedRow: number | null = null;

  toggleRow(id: number) {
    this.expandedRow = this.expandedRow === id ? null : id;
  }

}
