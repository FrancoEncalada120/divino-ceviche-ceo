import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InventoryListComponent } from "../../inventory/inventory-list/inventory-list.component";
import { InventoryService } from '../../../../core/services/inventory.service';
import { ButtonModule } from 'primeng/button';
import { PurchaseUpdInsComponent } from "../../purchase/purchase-upd-ins/purchase-upd-ins.component";
import { PurchaseConfirmationComponent } from "../../purchase/purchase-confirmation/purchase-confirmation.component";
import { Compra } from '../../../../core/models/compra.model';
import { Receta } from '../../../../core/models/receta.model';
import { CompraFullCreate } from '../../../../core/models/compra-full-create.model';
import { CompraFullResponse } from '../../../../core/models/compra-full-response.model';
import { CompraService } from '../../../../core/services/compra.service';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-stock-list',
  imports: [FormsModule, CardModule, TagModule, NgClass, TableModule, InventoryListComponent, NgIf, ButtonModule, PurchaseUpdInsComponent, PurchaseConfirmationComponent],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent implements OnInit {

  insumos: Insumo[] = [];
  insumoInventory: Insumo | null = null;

  private searchSubject = new Subject<string>();
  searchText: string = '';

  constructor(
    private insumoService: InsumoService,
    private inventoryService: InventoryService,
    private service: CompraService,
    private messageService: MessageService,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {

    this.load();

    this.searchSubject.pipe(
      debounceTime(1000),          // ⏱ espera 1 segundo
      filter(text => text.length >= 3 || text.length === 0) // 🔎 mínimo 3 letras
    ).subscribe(text => {
      this.searchText = text;
      this.load();
    });

  }

  load(): void {

    console.log('[Locations] load() start');
    console.log('Buscando:', this.searchText);

    this.insumoService.getInsumoAll({
      text: this.searchText, // string
    }).subscribe({
      next: (data) => {

        this.insumos = (data.insumos ?? [])
          //.filter(i => i.stock < i.stock_ideal)
          .sort((a, b) => (b.stock_ideal - b.stock) - (a.stock_ideal - a.stock));

      },
      error: (err) => {
        console.error('[Locations] GET error:', err);

      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  showInventoryModal = false;
  inventoryList: any[] = [];

  closeModal() {
    this.showInventoryModal = false;
  }

  mostrarPopupKardex(insumo_id: number, insumo: Insumo) {

    this.inventoryList = [];
    this.insumoInventory = insumo

    this.inventoryService.getAll({
      insumo_id: insumo_id, // string
    }).subscribe({
      next: (data) => {

        this.inventoryList = data ?? [];
        this.showInventoryModal = true;
      },
      error: (err) => {
        console.error('[inventoryService.getAll] GET error:', err);

      },
      complete: () => console.log('[inventoryService.getAll] GET complete'),
    });


  }

  showAddLocationModal = false;
  showConfirmanModal = false;
  modalMode: 'create' | 'edit' = 'create';
  recetas_impactadas: Receta[] = [];
  txtDetail: string = '';
  txtSummary: string = '';

  handleSubmit(compra: Compra) {

    const isCreate = this.modalMode === 'create';

    const CompraFullCreate: CompraFullCreate = {
      compra: compra,
      detalles: compra.detalles?.map(d => ({
        insumo_id: d.insumo_id,
        unidad_id: d.unidad_id,
        cantidad: d.cantidad,
        precio: d.precio,
        grupo_id: d.grupo_id,
      })) ?? []
    };

    const action$ = this.service.createFull(CompraFullCreate, compra.created_by ?? undefined)

    action$.subscribe({
      next: (savedLocation: CompraFullResponse) => {

        if (isCreate) {

          this.recetas_impactadas = savedLocation.receta_impactada;
          this.txtDetail = `The purchase has been successfully created with code ${savedLocation.compra.compra_id}. The following recipes have been impacted:`;
          this.txtSummary = 'Purchase created successfully';
          this.showConfirmanModal = true;

        }

        this.closeModalAdd();
        this.cartService.clearCart();
        this.load();

      },
      error: (err) => {

        //console.error('[Locations] save error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message
        });


      }
    });

  }

  openCreate() {
    this.modalMode = 'create';
    this.showAddLocationModal = true;
  }

  closeModalAdd() {
    this.showAddLocationModal = false;
  }

  closeModalConfirm() {
    this.showConfirmanModal = false;
  }


  addToCart(item: any) {

    this.cartService.addToCart(item);
  }

  isInCart(item: any): boolean {
    return this.cartService.isInCart(item);
  }

  getQty(item: any): number {
    return this.cartService.getQty(item);
  }

  increaseQty(item: any) {
    this.cartService.increaseQty(item);
  }

  decreaseQty(item: any) {
    this.cartService.decreaseQty(item);
  }

  get cart() {
    return this.cartService.getCart();
  }

}
