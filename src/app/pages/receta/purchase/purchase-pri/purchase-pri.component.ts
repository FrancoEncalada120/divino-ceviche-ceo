import { Component } from '@angular/core';
import { PurchaseUpdInsComponent } from '../purchase-upd-ins/purchase-upd-ins.component';
import { PurchaseListComponent } from '../purchase-list/purchase-list.component';
import { Compra } from '../../../../core/models/compra.model';
import { CompraService } from '../../../../core/services/compra.service';
import { NgIf } from '@angular/common';
import { CompraFullCreate } from '../../../../core/models/compra-full-create.model';
import { CompraFullResponse } from '../../../../core/models/compra-full-response.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-pri',
  imports: [FormsModule, PurchaseUpdInsComponent, PurchaseListComponent, NgIf, DatePickerModule],
  templateUrl: './purchase-pri.component.html',
  styleUrl: './purchase-pri.component.scss'
})
export class PurchasePriComponent {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;

  compras: Compra[] = [];
  selectedItem: Compra | null = null;
  loading = false;
  dateRange: Date[] | null = null;

  constructor(private service: CompraService
  ) { }

  ngOnInit(): void {

    // 📅 Inicializar con AYER
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.dateRange = [new Date(yesterday), new Date(today)];

    console.log('Init compras...', this.dateRange);

    this.load();
  }

  load(): void {

    this.loading = true;

    if (!this.dateRange || this.dateRange.length < 2) {
      return;
    }

    console.log('Cargando compras...', this.dateRange);

    // const startDate = this.dateRange[0].toISOString().split('T')[0];
    // const endDate = this.dateRange[1].toISOString().split('T')[0];

    const startDate = this.formatDate(this.dateRange[0]);
    const endDate = this.formatDate(this.dateRange[1]);

    console.log('Cargando compras con rango de fechas:', { startDate, endDate });

    this.service.getAll({
      fechaIni: startDate, // string
      fechaFin: endDate, // string
    }).subscribe({
      next: (data) => {
        this.compras = data ?? [];
        this.loading = false;

        console.log('[Compras] GET success:', this.compras);

      },
      error: (err) => {
        console.error('[Compras] GET error:', err);
        this.loading = false;
      },
      complete: () => console.log('[PurchasePriComponent] GET complete'),
    });


  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  handleSubmit(compra: Compra) {

    const isCreate = this.modalMode === 'create';

    const CompraFullCreate: CompraFullCreate = {
      compra: compra,
      detalles: compra.detalles?.map(d => ({
        insumo_id: d.insumo_id,
        unidad_id: d.unidad_id,
        cantidad: d.cantidad,
        precio: d.precio
      })) ?? []
    };

    const action$ = isCreate
      ? this.service.createFull(CompraFullCreate, compra.created_by ?? undefined)
      : this.service.updateFull(CompraFullCreate);

    action$.subscribe({
      next: (savedLocation: CompraFullResponse) => {

        console.log('[Compras] handleSubmit:', savedLocation);

        if (isCreate) {
          // ➕ CREATE → agregar al array
          this.compras.push(savedLocation.compra);
          this.load(); // recargar para mostrar la nueva compra
        } else {
          // ✏️ UPDATE → reemplazar en el array
          const index = this.compras.findIndex(
            l => l.compra_id === savedLocation.compra.compra_id
          );

          if (index !== -1) {
            this.compras[index] = savedLocation.compra;
          }
        }

        this.closeModal();
      },
      error: (err) => {
        console.error('[Locations] save error:', err);
      }
    });

  }

  openCreate() {
    this.modalMode = 'create';
    this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  openEdit(compra: Compra) {
    this.modalMode = 'edit';
    this.selectedItem = compra;
    this.showAddLocationModal = true;
  }

  delete(goal: Compra) {
    this.selectedItem = goal;
    this.showAddLocationModal = false;



  }

  onLocationsChangeDate(event: any) {
    console.log('Rango de fechas cambiado:', event);
    this.load();
  }

}
