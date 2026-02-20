import { Component } from '@angular/core';
import { PurchaseUpdInsComponent } from '../purchase-upd-ins/purchase-upd-ins.component';
import { PurchaseListComponent } from '../purchase-list/purchase-list.component';
import { Compra } from '../../../../core/models/compra.model';
import { CompraService } from '../../../../core/services/compra.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-pri',
  imports: [PurchaseUpdInsComponent, PurchaseListComponent, NgIf],
  templateUrl: './purchase-pri.component.html',
  styleUrl: './purchase-pri.component.scss'
})
export class PurchasePriComponent {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;
  editingInvoice: Compra | null = null;

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

  handleSubmit(invoice: Compra) {

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

}
