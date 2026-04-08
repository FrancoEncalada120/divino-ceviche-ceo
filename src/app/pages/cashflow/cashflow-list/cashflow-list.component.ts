import { Component, Input } from '@angular/core';
import { movimiento } from '../../../core/models/movimiento.model';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-cashflow-list',
  imports: [TableModule, TabViewModule],
  templateUrl: './cashflow-list.component.html',
  styleUrl: './cashflow-list.component.scss'
})
export class CashflowListComponent {


  @Input()
  movimientos: movimiento[] = [];

}
