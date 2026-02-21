import { Component } from '@angular/core';
import { PurchaseUpdInsComponent } from '../purchase-upd-ins/purchase-upd-ins.component';
import { PurchaseListComponent } from '../purchase-list/purchase-list.component';
import { Compra } from '../../../../core/models/compra.model';
import { CompraService } from '../../../../core/services/compra.service';
import { NgIf } from '@angular/common';
import { CompraFullCreate } from '../../../../core/models/compra-full-create.model';
import { CompraFullResponse } from '../../../../core/models/compra-full-response.model';

@Component({
  selector: 'app-purchase-pri',
  imports: [PurchaseUpdInsComponent, PurchaseListComponent, NgIf],
  templateUrl: './purchase-pri.component.html',
  styleUrl: './purchase-pri.component.scss'
})
export class PurchasePriComponent {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;

  compras: Compra[] = [];
  selectedItem: Compra | null = null;
  loading = false;

  constructor(private service: CompraService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.loading = true;

    this.service.getAll().subscribe({
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

    console.log('Editando compra: 2', compra);

    this.modalMode = 'edit';
    this.selectedItem = compra;
    this.showAddLocationModal = true;
  }

  delete(goal: Compra) {
    this.selectedItem = goal;
    this.showAddLocationModal = false;



  }

}
