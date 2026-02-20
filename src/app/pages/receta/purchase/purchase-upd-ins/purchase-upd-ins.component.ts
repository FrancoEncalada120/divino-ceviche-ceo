import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

import { Compra } from '../../../../core/models/compra.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CompraDetalle } from '../../../../core/models/compra-detalle.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { Insumo } from '../../../../core/models/insumo.model';
import { UnidadService } from '../../../../core/services/unidad.service';
import { Unidad } from '../../../../core/models/unidad.model';


@Component({
  selector: 'app-purchase-upd-ins',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    DatePickerModule, TableModule, ButtonModule, InputNumberModule,
  DropdownModule],
  templateUrl: './purchase-upd-ins.component.html',
  styleUrl: './purchase-upd-ins.component.scss'
})
export class PurchaseUpdInsComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Compra>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() compras: Compra | null = null;

  cInsumo: Insumo[] = [];
  cUnidad: Unidad[] = [];

  constructor(private service: InsumoService, private sUnid: UnidadService,) { }

  ngOnInit(): void {
    this.load();

    if (this.mode === 'edit' && this.compras) {
      this.formData = { ...this.compras };
    }

  }

  load(): void {

    this.service.getAll().subscribe({
      next: (data) => {
        this.cInsumo = data ?? [];

      },
      error: (err) => {
        console.error('[cInsumo] GET error:', err);

      },
      complete: () => console.log('[PurchasePriComponent] GET complete'),
    });

     this.sUnid.getAll().subscribe({
      next: (data) => {
        this.cUnidad = data ?? [];

      },
      error: (err) => {
        console.error('[cUnidad] GET error:', err);

      },
      complete: () => console.log('[PurchasePriComponent] GET complete'),
    });

  }

  formData: Partial<Compra> = {
    compra_id: 0,
    fecha: '',
    detalle: '',
  };

  onClose() {
    console.log('Closing modal');
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData as Compra);
  }


  // ================

  items: CompraDetalle[] = [];

  addRow() {
    this.items.push({
      detalle_id: 0,
      compra_id: 0,
      cantidad: 0,
      insumo_id: 1,
      precio: 0,
      total: 0,
      unidad_id: 0
    });
  }

  removeRow(index: number) {
    this.items.splice(index, 1);
  }


}
