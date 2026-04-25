import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { InputTextModule } from 'primeng/inputtext';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-insumos-lista',
  imports: [TableModule, Tag, InputTextModule, ButtonModule],
  templateUrl: './insumos-lista.component.html',
  styleUrl: './insumos-lista.component.scss',
})
export class InsumosListaComponent {
  @Input()
  insumos: Insumo[] = [];

  @Output() edit = new EventEmitter<Insumo>();
  @ViewChild('dt') dt!: Table;

  onEdit(insumo: Insumo) {
    this.edit.emit(insumo);
  }

  exportExcel() {
    const rows = this.insumos.map((item) => ({
      Id: item.insumo_id,
      Name: item.nombre,
      Group: item.grupo ?? '',
      Supplier: (item as any).proveedor?.nombre ?? '',
      Unit: (item as any).unidad?.abreviatura ?? (item as any).unidad?.nombre ?? '',
      Stock: (item as any).insumos_detalles?.[0]?.stock ?? 0,
      Status: item.estado === 'A' ? 'Active' : 'Inactive',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ingredients');
    XLSX.writeFile(wb, 'ingredients.xlsx');
  }
}
