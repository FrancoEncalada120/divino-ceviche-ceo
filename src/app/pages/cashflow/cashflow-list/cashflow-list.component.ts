import { Component, Input } from '@angular/core';
import { Concepto, MovimientoAgrupado } from '../../../core/models/cash-movimiento.model';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-cashflow-list',
  imports: [TableModule, TabViewModule, NgClass, NgForOf, NgIf],
  templateUrl: './cashflow-list.component.html',
  styleUrl: './cashflow-list.component.scss'
})
export class CashflowListComponent {

  col1: string = "15%";
  col2: string = "10%";
  col3: string = "10%";
  col4: string = "10%";
  col5: string = "10%";
  col6: string = "10%";
  col7: string = "10%";
  col8: string = "10%";
  col9: string = "10%";
  col10: string = "10%";

  @Input()
  movimientos: MovimientoAgrupado[] = [];

  mostrarImporte(row: Concepto[], concepto_id: number): number {

    console.log('Calculando saldo final para movimientos:', row);

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

      console.log('Saldo Final:', saldoFinal);

    }

    return saldoFinal;
  }

  getIconClassPrice(row: Concepto[], concepto_id: number): string {

    if (!row) return 'text-green-500';

    const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

    if (accion === '+') return `pi pi-arrow-up ${this.getColorPrice(row, concepto_id)}`;
    else if (accion === '-') return `pi pi-arrow-down ${this.getColorPrice(row, concepto_id)}`;
    else return `${this.getColorPrice(row, concepto_id)}`;
  }

  getColorPrice(row: Concepto[], concepto_id: number): string {

    if (!row) return 'text-gray-500';

    const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

    if (accion === '+') return `text-green-500`;
    else if (accion === '-') return `text-red-500`;
    else return 'text-gray-500';
  }

  toggleRow(row: any) {
    this.movimientos.forEach(r => r.expanded = false);
    row.expanded = !row.expanded;
  }


}
