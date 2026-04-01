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
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.models';


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
  @Input() detalle: CompraDetalle[] = [];

  cInsumo: Insumo[] = [];
  cUnidad: Unidad[] = [];
  locations: Location[] = [];
  user: User | null = null;
  fechaHoy: string = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  constructor(private service: InsumoService,
    private locationService: LocationService,
    private sUnid: UnidadService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.load();
    this.user = this.userService.getUser();

    if (this.detalle && this.detalle.length > 0) {

      for (const item of this.detalle) {

        this.items.push({
          detalle_id: 0,
          compra_id: 0,
          cantidad: item.cantidad,
          insumo_id: item.insumo_id,
          precio: 0,
          total: 0,
          unidad_id: item.unidad_id,
          grupo_id: item.grupo_id,
        });


      }


    } else
      this.addRow();

  }

  load(): void {

    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });

    this.service.getInsumoAll().subscribe({
      next: (data) => {
        this.cInsumo = data.insumos ?? [];
      },
      error: (err) => {
        console.error('[cInsumo] GET error:', err);

      },
      complete: () => { }
    });

    this.sUnid.getAll().subscribe({
      next: (data) => {
        this.cUnidad = data ?? [];

      },
      error: (err) => {
        console.error('[cUnidad] GET error:', err);

      },
      complete: () => {

      },
    });

  }

  formData: Partial<Compra> = {
    compra_id: 0,
    fecha: this.fechaHoy,
    detalle: '',
    total: 0,
    location_id: 7,
    created_by: this.user?.user_id,
    detalles: []
  };

  onClose() {
    this.close.emit();
  }

  onSubmit() {

    this.formData.detalles = this.items.map(item => ({
      detalle_id: 0,
      compra_id: 0,
      insumo_id: item.insumo_id,
      unidad_id: item.unidad_id,
      cantidad: item.cantidad,
      precio: item.precio,
      total: item.cantidad * item.precio,
      grupo_id: item.grupo_id,
    }));

    this.formData.created_by = this.user?.user_id;

    console.log('Form data to submit:', this.formData);

    this.submit.emit(this.formData as Compra);
  }


  // ================

  items: CompraDetalle[] = [];

  addRow() {

    this.items.push({
      detalle_id: 0,
      compra_id: 0,
      cantidad: 0,
      insumo_id: 0,
      precio: 0,
      total: 0,
      unidad_id: 0,
      grupo_id: 0,
    });
  }

  removeRow(index: number) {
    this.items.splice(index, 1);
  }

  onInsumoChange(insumoId: number, row: any) {

    // Verificar si ya existe ese insumo en otra fila
    const existe = this.items.some(item =>
      item.insumo_id === insumoId && item !== row
    );

    if (existe) {
      alert('Este insumo ya fue agregado.');
      row.insumo_id = null;
      return;
    }


    const insumoSeleccionado = this.cInsumo.find(i => i.insumo_id === insumoId);
    if (insumoSeleccionado) {

      console.log('Insumo seleccionado:', insumoSeleccionado);

      row.unidad_id = insumoSeleccionado.unidad.unidad_id; // asignar unidad automáticamente
      if (insumoSeleccionado.grupo_detalle && insumoSeleccionado.grupo_detalle.length > 0) {
        row.grupo_id = insumoSeleccionado.grupo_detalle[0].grupo_id;
      } else {
        row.grupo_id = 0; // o algún valor por defecto
      }
      // row.unidadesFiltradas = this.cUnidad.filter(u =>
      //   u.grupo === insumoSeleccionado.grupo
      // );

    } else {
      //row.unidadesFiltradas = [];
    }

    //row.unidad_id = null; // reset unidad
  }

  calcularTotal(row: any) {
    const cantidad = Number(row.cantidad) || 0;
    const precio = Number(row.precio) || 0;

    row.total = cantidad * precio;

    this.calcularTotalCompra();
  }

  calcularTotalCompra() {
    this.formData.total = this.items.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );
  }


}
