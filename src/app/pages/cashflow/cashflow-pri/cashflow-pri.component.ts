import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MovimientoAgrupado } from '../../../core/models/cash-movimiento.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { CashflowListComponent } from "../cashflow-list/cashflow-list.component";
import { cashMovimientoService } from '../../../core/services/cashmovimiento.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { NgIf } from '@angular/common';
import { CashflowListLingaComponent } from "../cashflow-list-linga/cashflow-list-linga.component";

@Component({
  selector: 'app-cashflow-pri',
  imports: [FormsModule, DatePickerModule, CashflowListComponent, MultiSelectModule, NgIf, CashflowListLingaComponent],
  templateUrl: './cashflow-pri.component.html',
  styleUrl: './cashflow-pri.component.scss'
})
export class CashflowPriComponent implements OnInit {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;
  //selectedItem: MovimientoAgrupado | null = null;

  dateRange: Date[] | null = null;
  movimientos: MovimientoAgrupado[] = [];
  movimientosLinga: MovimientoAgrupado[] = [];

  locations: Location[] = [];
  selectedLocations: Location[] = [];

  constructor(
    private service: cashMovimientoService,
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {


    // 📅 Inicializar con AYER
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 30);
    this.dateRange = [new Date(yesterday), new Date(today)];

    // -------------------------------------

    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        this.selectedLocations = this.locations;
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });




    // -------------------------------------

    this.load();


  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  load() {

    if (!this.dateRange || this.dateRange.length < 2) {
      return;
    }

    const startDate = this.formatDate(this.dateRange[0]);
    const endDate = this.formatDate(this.dateRange[1]);

    let provedores = "";
    if (this.selectedLocations.length != this.locations.length)
      provedores = this.selectedLocations.map((c) => c.location_id).join(',');

    this.service.getMovimientosAll({
      fechaIni: startDate,
      fechaFin: endDate,
      lstLocations: provedores,
    }).subscribe({
      next: (data) => {

        this.movimientos = data ?? [];

      },
      error: (err) => {


      },
      complete: () => { },
    });

    this.service.getMovimientosLingaAll({
      fechaIni: startDate,
      fechaFin: endDate,
      lstLocations: provedores,
    }).subscribe({
      next: (data) => {

        this.movimientosLinga = data ?? [];

      },
      error: (err) => {


      },
      complete: () => { },
    });

  }


  openCreate() {
    this.modalMode = 'create';
    //this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  onLocationsChangeDate(event: any) {
    this.load();
  }

  onLocationChange(event: any) {
    this.load();
  }


  get selectedLocationsNames(): string {

    if (!this.selectedLocations?.length) {
      return 'None';
    }

    if (this.selectedLocations.length === this.locations.length) {
      return 'All Supplies';
    }

    return this.selectedLocations.map((c) => c.location_name).join(', ');
  }

  get formattedDateRange(): string {
    if (
      !this.dateRange ||
      this.dateRange.length !== 2 ||
      !this.dateRange[0] ||
      !this.dateRange[1]
    ) {
      return 'No date selected';
    }

    const format = (d: Date) => d.toISOString().split('T')[0];

    return `${format(this.dateRange[0])} - ${format(this.dateRange[1])}`;
  }

}
