import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { Compra } from '../../../../core/models/compra.model';

@Component({
  selector: 'app-purchase-list',
  imports: [NgFor, NgIf, TxtsignoPipe],
  providers: [
    DecimalPipe
  ],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.scss'
})
export class PurchaseListComponent {

  @Input()
  compras: Compra[] = [];

  @Output() edit = new EventEmitter<Compra>();
  @Output() delete = new EventEmitter<Compra>();

  onEdit(comp: Compra) {

    console.log('Editando compra:', comp);
    this.edit.emit(comp);
  }

  onDelete(comp: Compra) {
    this.delete.emit(comp);
  }

}
