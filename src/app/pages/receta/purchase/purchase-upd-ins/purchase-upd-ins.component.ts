import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-purchase-upd-ins',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    NgIf,
  ],
  templateUrl: './purchase-upd-ins.component.html',
  styleUrl: './purchase-upd-ins.component.scss',
})
export class PurchaseUpdInsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Compra>();
  @Input() items: CompraDetalle[] = [];
  @Input() compra_order_id: number = 0;

  cInsumo: Insumo[] = [];
  cUnidad: Unidad[] = [];
  locations: Location[] = [];
  user: User | null = null;
  fechaHoy: string = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  constructor(
    private service: InsumoService,
    private locationService: LocationService,
    private sUnid: UnidadService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.user = this.userService.getUser();

    console.log('!this.items', !this.items, this.items);

    if (!this.items) this.addRow();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['items']) {
  //     console.log('items cambiaron:', this.items);
  //   }
  // }

  load(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        console.log('this.locations', this.locations);

        this.formData.location_id = this.user?.location_id;
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => {},
    });

    this.service
      .getInsumoAll({
        location_id: this.userService.getUser()?.location_id + '' || '',
      })
      .subscribe({
        next: (data) => {
          this.cInsumo = data.insumos ?? [];
        },
        error: (err) => {
          console.error('[cInsumo] GET error:', err);
        },
        complete: () => {},
      });

    this.sUnid.getAll().subscribe({
      next: (data) => {
        this.cUnidad = data ?? [];
      },
      error: (err) => {
        console.error('[cUnidad] GET error:', err);
      },
      complete: () => {},
    });
  }

  formData: Partial<Compra> = {
    compra_id: 0,
    fecha: this.fechaHoy,
    detalle: '',
    total: 0,
    location_id: this.user?.location_id,
    created_by: this.user?.user_id,
    detalles: [],
    compra_order_id: 0,
  };

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const invalidRow = this.items.find(
      (r) => !r.cantidad || r.cantidad <= 0 || !r.precio || r.precio <= 0,
    );
    if (invalidRow) {
      alert(
        'Please ensure all items have a valid quantity and price greater than zero.',
      );
      return; // ❌ no deja grabar
    }

    this.formData.detalles = this.items.map((item) => ({
      detalle_id: 0,
      compra_id: 0,
      compra_order_id: 0,
      insumo_id: item.insumo_id,
      unidad_id: item.unidad_id,
      cantidad: item.cantidad,
      precio: item.precio,
      total: item.cantidad * item.precio,
      grupo_id: item.grupo_id,
    }));

    this.formData.compra_order_id = this.compra_order_id;
    this.formData.created_by = this.user?.user_id;

    this.submit.emit(this.formData as Compra);
  }

  // ================

  addRow() {
    this.items.push({
      detalle_id: 0,
      compra_id: 0,
      compra_order_id: 0,
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
    const existe = this.items.some(
      (item) => item.insumo_id === insumoId && item !== row,
    );

    if (existe) {
      alert('Este insumo ya fue agregado.');
      row.insumo_id = null;
      return;
    }

    const insumoSeleccionado = this.cInsumo.find(
      (i) => i.insumo_id === insumoId,
    );
    if (insumoSeleccionado) {
      console.log('Insumo seleccionado:', insumoSeleccionado);

      row.unidad_id = insumoSeleccionado.unidad?.unidad_id ?? 0;
      if (
        insumoSeleccionado.grupo_detalle &&
        insumoSeleccionado.grupo_detalle.length > 0
      ) {
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
      0,
    );
  }

  exportToPdf() {
    const doc = new jsPDF({ unit: 'mm', format: 'letter' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 14;
    const navy: [number, number, number] = [31, 73, 125];
    const lightGray: [number, number, number] = [242, 242, 242];
    const white: [number, number, number] = [255, 255, 255];
    const colW = (pageW - margin * 2) / 2 - 2;
    const col2X = margin + colW + 4;
    let y = 14;

    // ── LOGO placeholder ──────────────────────────────────────
    doc.setFillColor(...navy);
    doc.roundedRect(margin, y, 28, 18, 2, 2, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGO', margin + 14, y + 11, { align: 'center' });

    // ── Título ────────────────────────────────────────────────
    doc.setTextColor(...navy);
    doc.setFontSize(20);
    doc.text('Orden de compra', margin + 33, y + 8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Pre-orden / Borrador', margin + 33, y + 14);

    // ── Info empresa (derecha) ────────────────────────────────
    const location = this.locations.find(
      (l) => l.location_id == this.formData.location_id,
    );
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    [
      'Divino Ceviche',
      location?.location_name ?? '---',
      'Tel: ---',
      'info@divinoceviche.com',
    ].forEach((line, i) =>
      doc.text(line, pageW - margin, y + 4 + i * 4, { align: 'right' }),
    );

    y += 24;

    // ── Barra N° orden / Fecha ────────────────────────────────
    doc.setFillColor(...navy);
    doc.rect(margin, y, pageW - margin * 2, 8, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `N° orden: ${this.formData.compra_id || '---'}`,
      margin + 3,
      y + 5.5,
    );
    doc.text(
      `Fecha: ${this.formData.fecha ?? '---'}`,
      pageW - margin - 3,
      y + 5.5,
      { align: 'right' },
    );
    y += 12;

    // ── Cabeceras VENDEDOR / ENVIAR A ─────────────────────────
    [margin, col2X].forEach((x) => {
      doc.setFillColor(...navy);
      doc.rect(x, y, colW, 7, 'F');
    });
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('VENDEDOR', margin + 3, y + 5);
    doc.text('ENVIAR A', col2X + 3, y + 5);
    y += 7;

    // ── Bloques de info ───────────────────────────────────────
    const boxH = 26;
    [margin, col2X].forEach((x) => {
      doc.setFillColor(...lightGray);
      doc.rect(x, y, colW, boxH, 'F');
    });
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const userName =
      `${this.user?.user_name ?? ''} ${this.user?.user_apellido ?? ''}`.trim();
    [
      [
        'Divino Ceviche',
        `Responsable: ${userName}`,
        `Ubicación: ${location?.location_name ?? '---'}`,
      ],
      [
        'Divino Ceviche',
        location?.location_name ?? '---',
        `Fecha entrega: ${this.formData.fecha ?? '---'}`,
      ],
    ].forEach((lines, col) => {
      const x = col === 0 ? margin : col2X;
      lines.forEach((line, i) => doc.text(line, x + 3, y + 6 + i * 6));
    });
    y += boxH + 6;

    // ── Tabla de productos ────────────────────────────────────
    const rows = this.items
      .filter((it) => it.insumo_id)
      .map((it, i) => {
        const nombre =
          this.cInsumo.find((x) => x.insumo_id === it.insumo_id)
            ?.nombreCompleto ?? '---';
        return [
          i + 1,
          nombre,
          it.cantidad,
          `$ ${Number(it.precio).toFixed(2)}`,
          `$ ${Number(it.total).toFixed(2)}`,
        ];
      });

    while (rows.length < 8) rows.push(['', '', '', '', '']);

    const subtotal = Number(this.formData.total) || 0;

    autoTable(doc, {
      startY: y,
      head: [['#', 'DESCRIPCIÓN', 'CANTIDAD', 'PRECIO UNITARIO', 'TOTAL']],
      body: rows,
      foot: [
        [
          {
            content: 'SUBTOTAL',
            colSpan: 4,
            styles: { halign: 'right', fontStyle: 'bold' },
          },
          `$ ${subtotal.toFixed(2)}`,
        ],
        [
          { content: 'DESCUENTO', colSpan: 4, styles: { halign: 'right' } },
          '$ 0.00',
        ],
        [
          {
            content: 'TOTAL',
            colSpan: 4,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fillColor: navy,
              textColor: white,
            },
          },
          {
            content: `$ ${subtotal.toFixed(2)}`,
            styles: { fontStyle: 'bold', fillColor: navy, textColor: white },
          },
        ],
      ],
      headStyles: {
        fillColor: navy,
        textColor: white,
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, minCellHeight: 7 },
      footStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 22, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 28, halign: 'right' },
      },
      margin: { left: margin, right: margin },
      styles: { lineColor: [200, 200, 200], lineWidth: 0.2 },
    });

    const finalY: number = (doc as any).lastAutoTable.finalY + 8;

    // ── Comentarios ───────────────────────────────────────────
    doc.setFillColor(...navy);
    doc.rect(margin, finalY, pageW - margin * 2, 7, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('COMENTARIOS E INSTRUCCIONES ESPECIALES', margin + 3, finalY + 5);

    doc.setFillColor(...lightGray);
    doc.rect(margin, finalY + 7, pageW - margin * 2, 18, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      this.formData.detalle || 'Sin comentarios adicionales.',
      margin + 3,
      finalY + 14,
    );

    doc.save(`orden-compra-${this.formData.fecha || 'draft'}.pdf`);
  }
}
