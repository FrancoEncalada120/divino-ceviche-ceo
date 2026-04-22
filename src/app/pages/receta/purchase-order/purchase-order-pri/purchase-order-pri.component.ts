import { Component } from '@angular/core';
import { PurchaseOrderUpdInsComponent } from '../purchase-order-upd-ins/purchase-order-upd-ins.component';
import { PurchaseOrderListComponent } from '../purchase-order-list/purchase-order-list.component';
import { Compra } from '../../../../core/models/compra.model';
import { CompraService } from '../../../../core/services/compra.service';
import { NgIf } from '@angular/common';
import { CompraFullCreate } from '../../../../core/models/compra-full-create.model';
import { CompraFullResponse } from '../../../../core/models/compra-full-response.model';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Receta } from '../../../../core/models/receta.model';
import { PurchaseOrderConfirmationComponent } from "../purchase-order-confirmation/purchase-order-confirmation.component";
import { ProveedorService } from '../../../../core/services/ProveedorService';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { DropdownModule } from 'primeng/dropdown';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin, Subject, switchMap } from 'rxjs';
import { CartService } from '../../../../core/services/cart.service';
import { debounceTime } from 'rxjs/operators';
import { PurchaseUpdInsComponent } from "../../purchase/purchase-upd-ins/purchase-upd-ins.component";
import { PurchaseConfirmationComponent } from "../../purchase/purchase-confirmation/purchase-confirmation.component";

@Component({
  selector: 'app-order-purchase-pri',
  imports: [FormsModule, PurchaseOrderUpdInsComponent, PurchaseOrderListComponent, NgIf,
    DatePickerModule, ButtonModule, PurchaseOrderConfirmationComponent, DropdownModule, MultiSelectModule, PurchaseUpdInsComponent, PurchaseConfirmationComponent],
  templateUrl: './purchase-order-pri.component.html',
  styleUrl: './purchase-order-pri.component.scss'
})
export class PurchaseOrderPriComponent {

  showAddLocationModal = false;
  showConfirmanModal = false;

  showAddPurchaseModal = false;
  showConfirmanPurchaseModal = false;

  txtDetail: string = '';
  txtSummary: string = '';

  compraDetalle: CompraDetalle[] = [];
  proveedores: Proveedor[] = [];
  insumos: Insumo[] = [];
  recetas_impactadas: Receta[] = [];

  selectedItem: Compra | null = null;
  loading = false;
  dateRange: Date[] | null = null;

  selectedProveedor!: Proveedor[];
  selectedInsumos!: Insumo[];

  constructor(
    private service: CompraService,
    private messageService: MessageService,
    private proveedorService: ProveedorService,
    private insumoService: InsumoService
  ) { }

  ngOnInit(): void {

    // 📅 Inicializar con AYER
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 7);

    this.dateRange = [new Date(yesterday), new Date(today)];

    this.load(true);

    this.SupplyChange$.pipe(debounceTime(2000)).subscribe(() => {
      this.load(false);
    });

  }

  load(bIncial: boolean): void {

    this.loading = true;

    if (!this.dateRange || this.dateRange.length < 2) {
      return;
    }

    const startDate = this.formatDate(this.dateRange[0]);
    const endDate = this.formatDate(this.dateRange[1]);

    this.loading = true;

    forkJoin({
      proveedores: this.proveedorService.getAll(),
      insumosResp: this.insumoService.getInsumoAll()
    }).pipe(

      // 🔥 aquí encadenas la segunda llamada
      switchMap(({ proveedores, insumosResp }) => {

        if (bIncial) {
          // ✅ proveedores
          this.proveedores = proveedores;
          this.selectedProveedor = this.proveedores;

          // ✅ insumos
          this.insumos = insumosResp.insumos;
          this.selectedInsumos = this.insumos;
        }

        // 🔥 construir parámetros
        let insumos = "";
        if (this.selectedInsumos && this.selectedInsumos.length != this.insumos.length)
          insumos = this.selectedInsumos.map((c) => c.insumo_id).join(',');

        let provedores = "";
        if (this.selectedProveedor && this.selectedProveedor.length != this.proveedores.length)
          provedores = this.selectedProveedor.map((c) => c.proveedor_id).join(',');

        // 🚀 segunda llamada (retornas observable)
        return this.service.getComprasOrderAll({
          fechaIni: startDate,
          fechaFin: endDate,
          lstProveedor: provedores,
          lstInsumo: insumos,
        });
      })

    ).subscribe({

      next: (data) => {
        this.compraDetalle = data ?? [];
        this.loading = false;
      },

      error: (err) => {
        console.error('Error loading data:', err);
        this.loading = false;
      }

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

  closeModalConfirm() {
    this.showConfirmanModal = false;
  }

  closeModalPurchaseAdd() {
    this.showAddPurchaseModal = false;
  }

  closeModalPurchaseConfirm() {
    this.showConfirmanPurchaseModal = false;
  }

  handleSubmitOrder(compra: Compra) {

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

    const action$ = this.service.createFullOrder(CompraFullCreate, compra.created_by ?? undefined)

    action$.subscribe({
      next: (savedLocation: CompraFullResponse) => {

        // ➕ CREATE → agregar al array
        //this.compras.push(savedLocation.compra);
        this.load(false); // recargar para mostrar la nueva compra

        this.recetas_impactadas = [];
        this.txtDetail = `The purchase has been successfully created with code ${savedLocation.compra.compra_id}. The following recipes have been impacted:`;
        this.txtSummary = 'Purchase created successfully';
        this.showConfirmanModal = true;

        this.closeModal();
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


  handleSubmit(compra: Compra) {



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


        // ➕ CREATE → agregar al array
        //this.compras.push(savedLocation.compra);
        this.load(false); // recargar para mostrar la nueva compra

        this.recetas_impactadas = savedLocation.receta_impactada;
        this.txtDetail = `The purchase has been successfully created with code ${savedLocation.compra.compra_id}. The following recipes have been impacted:`;
        this.txtSummary = 'Purchase created successfully';
        this.showConfirmanModal = true;

        this.closeModal();
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
    this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  delete(compra: Compra) {

    this.selectedItem = compra;
    this.showAddLocationModal = false;

    if (!compra?.compra_order_id) return;

    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar la compra ${compra.compra_order_id}?`
    );

    if (!confirmDelete) return;

    this.service.deleteCompraOrder(compra.compra_order_id).subscribe({
      next: () => {

        // 🔥 eliminar del array local (UX rápida)
        this.compraDetalle = this.compraDetalle.filter(
          c => c.compra_order_id !== compra.compra_order_id
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Compra eliminada correctamente',
        });

        this.load(false); // recargar para actualizar la lista

      },
      error: (err) => {
        console.error('[Compras] delete error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Error eliminando compra',
        });
      }
    });
  }

  items: CompraDetalle[] = [];

  complete(deltalle: CompraDetalle) {

    this.items = deltalle.compra_order!.order_detalles.map(det => ({ ...det }));
    console.log(' this.items', this.items);

    this.showAddPurchaseModal = true;

  }

  private SupplyChange$ = new Subject<void>();

  onSupplyChange(event: any) {
    this.SupplyChange$.next();
  }

  onLocationsChangeDate(event: any) {
    this.load(false);
  }

  get selectedProveedorNames(): string {

    if (!this.selectedProveedor?.length) {
      return 'None';
    }

    if (this.selectedProveedor.length === this.proveedores.length) {
      return 'All Suppliers';
    }

    return this.selectedProveedor.map((c) => c.nombre).join(', ');
  }

  get selectedInsumosNames(): string {

    if (!this.selectedInsumos?.length) {
      return 'None';
    }

    if (this.selectedInsumos.length === this.insumos.length) {
      return 'All Supplies';
    }

    return this.selectedInsumos.map((c) => c.nombre).join(', ');
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
