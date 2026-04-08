import { Component, EventEmitter, Output } from '@angular/core';
import { movimiento } from '../../../core/models/movimiento.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CashflowListComponent } from "../cashflow-list/cashflow-list.component";

@Component({
  selector: 'app-cashflow-pri',
  imports: [FormsModule, DatePickerModule, CashflowListComponent],
  templateUrl: './cashflow-pri.component.html',
  styleUrl: './cashflow-pri.component.scss'
})
export class CashflowPriComponent {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;
  selectedItem: movimiento | null = null;

  dateRange: Date[] | null = null;
  movimientos: movimiento[] = [];

  openCreate() {
    this.modalMode = 'create';
    this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  onLocationsChangeDate(event: any) {
    // this.load(false);
  }


}
