import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Concepto, MovimientoAgrupado } from '../../../core/models/cash-movimiento.model';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TxtsignoPipe } from '../../../core/pipes/txtsigno.pipe';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-cashflow-list',
  imports: [TableModule, NgClass, TxtsignoPipe, TreeTableModule],
  templateUrl: './cashflow-list.component.html',
  styleUrl: './cashflow-list.component.scss'
})
export class CashflowListComponent implements OnChanges {

  @Input()
  movimientos: MovimientoAgrupado[] = [];

  treeData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movimientos'] && this.movimientos) {
      this.buildTree();
    }
  }

  buildTree() {

    this.treeData = this.movimientos.map(row => ({
      data: row,
      children: row.detalle.map((loc: any) => ({
        data: {
          ...loc,
          isDetail: true
        }
      }))
    }));

  }

  mostrarImporte(row: Concepto[], concepto_id: number): number {

    const movimiento = row.find(mov => mov.concepto_id === concepto_id)?.total;

    return movimiento ? movimiento : 0;
  }

  SaldoFinal(row: Concepto[]): number {

    let saldoFinal: number = 0;
    for (let i = 0; i < row.length; i++) {

      if (row[i].concepto_accion === '+') {
        saldoFinal += Number(row[i].total);
      } else if (row[i].concepto_accion === '-') {
        saldoFinal -= Number(row[i].total);
      }

    }

    return saldoFinal;
  }

  getIconClassPrice(row: Concepto[], concepto_id: number): string {

    if (!row) return 'text-green-500';

    const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

    if (accion === '+') return `pi pi-plus ${this.getColorPrice(row, concepto_id)}`;
    else if (accion === '-') return `pi pi-minus ${this.getColorPrice(row, concepto_id)}`;
    else return `${this.getColorPrice(row, concepto_id)}`;
  }

  getColorPrice(row: Concepto[], concepto_id: number): string {

    if (!row) return 'text-gray-500';

    const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

    if (accion === '+') return `text-green-500`;
    else if (accion === '-') return `text-red-500`;
    else return 'text-gray-500';
  }


}
