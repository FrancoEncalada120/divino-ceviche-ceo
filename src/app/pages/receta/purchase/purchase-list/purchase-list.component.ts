import { DecimalPipe} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { Compra } from '../../../../core/models/compra.model';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';

@Component({
  selector: 'app-purchase-list',
  imports: [TableModule, TabViewModule, TxtsignoPipe],
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

  onDelete(comp: Compra) {
    this.delete.emit(comp);
  }

}
