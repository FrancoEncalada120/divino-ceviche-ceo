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
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Receta } from '../../../../core/models/receta.model';
import { PurchaseConfirmationComponent } from "../purchase-confirmation/purchase-confirmation.component";
import { ProveedorService } from '../../../../core/services/ProveedorService';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { DropdownModule } from 'primeng/dropdown';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';
import { InsumoService } from '../../../../core/services/insumo.service';

@Component({
  selector: 'app-purchase-pri',
  imports: [FormsModule, PurchaseUpdInsComponent, PurchaseListComponent, NgIf,
    DatePickerModule, ButtonModule, PurchaseConfirmationComponent, DropdownModule],
  templateUrl: './purchase-pri.component.html',
  styleUrl: './purchase-pri.component.scss'
})
export class PurchasePriComponent {

  modalMode: 'create' | 'edit' = 'create';
  showAddLocationModal = false;
  showConfirmanModal = false;
  txtDetail: string = '';
  txtSummary: string = '';

  compraDetalle: CompraDetalle[] = [];
  proveedores: Proveedor[] = [];
  insumos: Insumo[] = [];
  recetas_impactadas: Receta[] = [];

  selectedItem: Compra | null = null;
  loading = false;
  dateRange: Date[] | null = null;

  selectedProveedor: number = 0;
  selectedInsumos: number = 0;

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
    yesterday.setDate(yesterday.getDate() - 1);

    this.dateRange = [new Date(yesterday), new Date(today)];

    this.load(true);
  }

  load(bIncial: boolean): void {

    this.loading = true;

    if (!this.dateRange || this.dateRange.length < 2) {
      return;
    }

    const startDate = this.formatDate(this.dateRange[0]);
    const endDate = this.formatDate(this.dateRange[1]);

    if (bIncial) {
      this.proveedorService.getAll().subscribe({
        next: (data) => {
          this.proveedores = data;
        },
        error: (err) => {
          console.error('Error loading proveedores:', err);
        }
      });



      this.proveedorService.getAll().subscribe({
        next: (data) => {
          this.proveedores = data;
        },
        error: (err) => {
          console.error('Error loading proveedores:', err);
        }
      });

      this.insumoService.getInsumoAll().subscribe({
        next: (data) => {

          this.insumos = Array.isArray(data?.insumos) ? data.insumos : [];

        },
        error: (err) => {
          console.error('[LOAD] error:', err);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          console.log('[LOAD] complete');
        },
      });

    }

    this.service.getComprasAll({
      fechaIni: startDate, // string
      fechaFin: endDate, // string
      proveedorId: this.selectedProveedor, // number | null
      insumoId: this.selectedInsumos, // number | null
    }).subscribe({
      next: (data) => {
        this.compraDetalle = data ?? [];
        this.loading = false;

      },
      error: (err) => {
        console.error('[compraDetalle] GET error:', err);
        this.loading = false;
      },
      complete: () => { },
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
          // ➕ CREATE → agregar al array
          //this.compras.push(savedLocation.compra);
          this.load(false); // recargar para mostrar la nueva compra

          this.recetas_impactadas = savedLocation.receta_impactada;
          this.txtDetail = `The purchase has been successfully created with code ${savedLocation.compra.compra_id}. The following recipes have been impacted:`;
          this.txtSummary = 'Purchase created successfully';
          this.showConfirmanModal = true;

        }

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
    this.modalMode = 'create';
    this.selectedItem = null;
    this.showAddLocationModal = true;
  }

  openEdit(compra: Compra) {
    this.modalMode = 'edit';
    this.selectedItem = compra;
    this.showAddLocationModal = true;
  }


  delete(compra: Compra) {

    this.selectedItem = compra;
    this.showAddLocationModal = false;

    if (!compra?.compra_id) return;

    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar la compra ${compra.compra_id}?`
    );

    if (!confirmDelete) return;

    this.service.deleteCompra(compra.compra_id).subscribe({
      next: () => {

        // 🔥 eliminar del array local (UX rápida)
        this.compraDetalle = this.compraDetalle.filter(
          c => c.compra_id !== compra.compra_id
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

  onLocationsChangeDate(event: any) {
    this.load(false);
  }

}
