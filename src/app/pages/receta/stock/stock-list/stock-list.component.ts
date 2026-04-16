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
import { InventoryListComponent } from '../../inventory/inventory-list/inventory-list.component';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ButtonModule } from 'primeng/button';
import { PurchaseUpdInsComponent } from '../../purchase/purchase-upd-ins/purchase-upd-ins.component';
import { PurchaseConfirmationComponent } from '../../purchase/purchase-confirmation/purchase-confirmation.component';
import { Compra } from '../../../../core/models/compra.model';
import { Receta } from '../../../../core/models/receta.model';
import { CompraFullCreate } from '../../../../core/models/compra-full-create.model';
import { CompraFullResponse } from '../../../../core/models/compra-full-response.model';
import { CompraService } from '../../../../core/services/compra.service';
import { MessageService } from 'primeng/api';
import { CartService } from '../../../../core/services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.models';

@Component({
  selector: 'app-stock-list',
  imports: [
    FormsModule,
    CardModule,
    TagModule,
    NgClass,
    TableModule,
    InventoryListComponent,
    NgIf,
    ButtonModule,
    PurchaseUpdInsComponent,
    PurchaseConfirmationComponent,
    MultiSelectModule,
    InputTextModule,
  ],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss',
})
export class StockListComponent implements OnInit {
  insumos: Insumo[] = [];
  insumoInventory: Insumo | null = null;

  private searchSubject = new Subject<string>();
  private locationChange$ = new Subject<void>();
  locations: Location[] = [];
  selectedLocation!: Location[];
  searchText: string = '';
  source!: string;
  title!: string;
  subtitle!: string;
  user: User | null = null;

  constructor(
    private insumoService: InsumoService,
    private inventoryService: InventoryService,
    private service: CompraService,
    private messageService: MessageService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.source = this.route.snapshot.data['source'];
    this.user = this.userService.getUser();

    this.cartService.clearCart();

    if (this.source === 'stock') {
      this.title = 'Low Stock Alert';
      this.subtitle =
        'Items listed below have inventory levels lower than the recommended stock level and should be replenished.';
    } else {
      this.title = 'Update Inventory';
      this.subtitle =
        'Search for the product and update the quantity currently available in inventory.';
    }

    this.load();

    this.searchSubject
      .pipe(
        debounceTime(1000), // ⏱ espera 1 segundo
        filter((text) => text.length >= 3 || text.length === 0), // 🔎 mínimo 3 letras
      )
      .subscribe((text) => {
        this.searchText = text;
        this.load();
      });

    this.locationChange$.pipe(debounceTime(1000)).subscribe(() => {
      console.log('Locations changed, reloading dashboard...');
    });
  }

  load(): void {
    console.log('[Locations] load() start');
    console.log('Buscando:', this.searchText);

    this.insumoService
      .getInsumoAll({
        text: this.searchText, // string
      })
      .subscribe({
        next: (data) => {
          this.insumos = (data.insumos ?? [])
            //.filter(i => i.stock < i.stock_ideal)
            .sort(
              (a, b) => b.stock_ideal - b.stock - (a.stock_ideal - a.stock),
            );
        },
        error: (err) => {
          console.error('[Locations] GET error:', err);
        },
        complete: () => console.log('[Locations] GET complete'),
      });
  }

  onLocationsChange() {
    this.locationChange$.next();
    this.load();
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
    this.insumoInventory = insumo;

    this.inventoryService
      .getAll({
        insumo_id: insumo_id, // string
      })
      .subscribe({
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
      detalles:
        compra.detalles?.map((d) => ({
          insumo_id: d.insumo_id,
          unidad_id: d.unidad_id,
          cantidad: d.cantidad,
          precio: d.precio,
          grupo_id: d.grupo_id,
        })) ?? [],
    };

    const action$ = this.service.createFull(
      CompraFullCreate,
      compra.created_by ?? undefined,
    );

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
          detail: err.error?.message,
        });
      },
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
  updateQty(item: any, value: any) {
    const qty = Number(value);

    this.cartService.updateQty(item, qty);
  }

  get cart() {
    return this.cartService.getCart();
  }

  timers: Map<number, any> = new Map();

  onCantidadChange(valor: string, item: any) {
    const cantidad = Number(valor);

    if (this.timers.get(item.insumo_id)) {
      clearTimeout(this.timers.get(item.insumo_id));
    }

    const timer = setTimeout(() => {
      this.actualizarInventario(cantidad, item);
    }, 1000);

    this.timers.set(item.insumo_id, timer);
  }

  actualizarInventario(cantidad: number, item: any) {
    const auditUserId = this.userService.getUser()?.user_id;

    this.insumoService
      .updateStock(item.insumo_id, cantidad, auditUserId || 1)
      .subscribe({
        next: (res) => {
          item.stock = res.stock;

          this.messageService.add({
            severity: 'success',
            summary: 'Inventario actualizado',
            detail: 'Se actualizó el inventario del producto: ' + item.nombre,
          });
        },
        error: (err) => {
          console.error(err);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el inventario',
          });
        },
      });
  }
}
