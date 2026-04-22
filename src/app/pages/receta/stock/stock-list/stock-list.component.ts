import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import {
  DIA_INVENTARIO_OPTIONS,
  FRECUENCIA_INVENTARIO_OPTIONS,
  Insumo,
  INVENTARIABLE_OPTIONS,
  UpdateStockInsumoDto,
} from '../../../../core/models/insumo.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InventoryListComponent } from '../../inventory/inventory-list/inventory-list.component';
import { InventoryService } from '../../../../core/services/inventory.service';
import { ButtonModule } from 'primeng/button';
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
import { DropdownModule } from 'primeng/dropdown';
import { TimeAgoPipe } from '../../../../core/pipes/timeAgo';
import { PurchaseOrderConfirmationComponent } from "../../purchase-order/purchase-order-confirmation/purchase-order-confirmation.component";
import { PurchaseOrderUpdInsComponent } from "../../purchase-order/purchase-order-upd-ins/purchase-order-upd-ins.component";
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';
import { Grupo } from '../../../../core/models/grupos.model';

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
    MultiSelectModule,
    InputTextModule,
    DatePipe,
    DropdownModule,
    TimeAgoPipe,
    PurchaseOrderConfirmationComponent,
    PurchaseOrderUpdInsComponent
  ],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss',
})
export class StockListComponent implements OnInit {

  insumos: Insumo[] = [];
  grupo: Grupo[] = [];

  insumoInventory: Insumo | null = null;

  private searchSubject = new Subject<string>();
  private locationChange$ = new Subject<void>();
  locations: Location[] = [];
  selectedLocation!: Location;
  searchText: string = '';
  source!: string;
  title!: string;
  subtitle!: string;
  user: User | null = null;

  frecuenciaInventarioOptions = FRECUENCIA_INVENTARIO_OPTIONS;
  diaInventarioOptions = DIA_INVENTARIO_OPTIONS;
  inventariableOptions = INVENTARIABLE_OPTIONS;
  frecuenciaInventario: string | null = null;
  diaInventario: string | null = null;

  constructor(
    private insumoService: InsumoService,
    private inventoryService: InventoryService,
    private service: CompraService,
    private messageService: MessageService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private userService: UserService,
    private locationService: LocationService,
  ) { }

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
    this.loadLocations();

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


    this.insumoService
      .getInsumoAll({
        text: this.searchText,
        dia_inventario: this.diaInventario || '',
        frecuencia_inventario: this.frecuenciaInventario || '',
        location_id: this.userService.getUser()?.location_id || 0,
      })
      .subscribe({
        next: (data) => {


          this.grupo = data.grupos;
          this.insumos = (data.insumos ?? []).sort((a, b) => {
            const invA = a.insumos_detalles?.[0];
            const invB = b.insumos_detalles?.[0];

            const diffB = (invB?.stock_ideal ?? 0) - (invB?.stock ?? 0);
            const diffA = (invA?.stock_ideal ?? 0) - (invA?.stock ?? 0);

            return diffB - diffA;
          });
        },
        error: (err) => {
          console.error('[Locations] GET error:', err);
        },
        complete: () => console.log('[Locations] GET complete'),
      });
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];

        const location_id = this.userService.getUser()?.location_id;
        this.selectedLocation = this.locations.find(x => x.location_id === location_id)!;

      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });
  }

  loadData() {
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

  addToCart(item: Insumo) {

    if (!item)
      return;

    //console.log('this.selectedLocation', this.selectedLocation);
    const location_id: number = this.selectedLocation.location_id || 0;

    const insumoDet = item.insumos_detalles?.find(x => x.location_id == location_id);
    //console.log('insumoDet', insumoDet);
    console.log('item', item);

    let cant = (insumoDet?.stock_ideal || 0) - (insumoDet?.stock || 0);
    if (cant <= 0)
      cant = 1;


    let grupoId = 0;
    if (item.grupo_detalle && item.grupo_detalle?.length > 0)
      grupoId = item.grupo_detalle![0].grupo_id

    const det: CompraDetalle = {
      cantidad: cant,
      compra_id: 0,
      compra_order_id: 0,
      detalle_id: 0,
      grupo_id: grupoId,
      insumo_id: item.insumo_id,
      precio: insumoDet?.precio_final || 0,
      total: cant * (insumoDet?.precio_final || 0),
      unidad_id: item?.unidad_id || 0
    };

    console.log(det);

    this.cartService.addToCart(det);

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

  pendingUpdates = new Map<number, UpdateStockInsumoDto>();

  actualizarInventario(cantidad: number, item: any) {
    const auditUserId = this.userService.getUser()?.user_id;

    const payload: UpdateStockInsumoDto = {
      cantidad: cantidad,
      location_id: item.insumos_detalles[0].location_id,
      updated_by: auditUserId || 1,
    };

    // Validar si ya existe
    if (this.pendingUpdates.has(item.insumo_id)) {
      // Solo actualiza la cantidad
      const existing = this.pendingUpdates.get(item.insumo_id)!;
      existing.cantidad = cantidad;
    } else {
      this.pendingUpdates.set(item.insumo_id, payload);
    }

    // Opcional: actualizar UI
    item.stock = cantidad;
    item.ultima_toma_inventario = new Date();
  }

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

  guardarTodo() {
    const updatesArray = Array.from(this.pendingUpdates.entries()).map(
      ([insumo_id, payload]) => ({
        insumo_id,
        ...payload,
      }),
    );

    this.insumoService.updateStockBatch(updatesArray).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Inventario actualizado',
          detail: 'Se guardaron todos los cambios',
        });

        this.pendingUpdates.clear();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron guardar los cambios',
        });
      },
    });
  }
}
