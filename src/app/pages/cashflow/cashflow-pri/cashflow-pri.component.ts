import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MovimientoAgrupado } from '../../../core/models/cash-movimiento.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CashflowListComponent } from "../cashflow-list/cashflow-list.component";
import { cashMovimientoService } from '../../../core/services/cashmovimiento.service';

@Component({
  selector: 'app-cashflow-pri',
  imports: [FormsModule, DatePickerModule, CashflowListComponent],
  templateUrl: './cashflow-pri.component.html',
  styleUrl: './cashflow-pri.component.scss'
})
export class CashflowPriComponent implements OnInit {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;
  selectedItem: MovimientoAgrupado | null = null;

  dateRange: Date[] | null = null;
  movimientos: MovimientoAgrupado[] = [];

  constructor(
    private service: cashMovimientoService,
  ) { }

  ngOnInit(): void {

    this.service.getAll().subscribe({
      next: (data) => {

        this.movimientos = data ?? [];

      },
      error: (err) => {


      },
      complete: () => { },
    });


  }

  openCreate() {
    this.modalMode = 'create';
    this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  onLocationsChangeDate(event: any) {
    // this.load(false);
  }


}
