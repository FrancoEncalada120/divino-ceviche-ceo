import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { GesCargo } from '../../../../core/models/ges-cargo.model';

@Component({
  selector: 'app-ges-cargo-list',
  imports: [TableModule, ButtonModule, TagModule],
  templateUrl: './ges-cargo-list.component.html',
  styleUrl: './ges-cargo-list.component.scss',
})
export class GesCargoListComponent {
  @Input()
  cargos: GesCargo[] = [];

  @Output() edit = new EventEmitter<GesCargo>();
  @Output() delete = new EventEmitter<GesCargo>();

  onEdit(item: GesCargo) {
    this.edit.emit(item);
  }

  onDelete(item: GesCargo) {
    this.delete.emit(item);
  }

  exportExcel() {
    const rows = this.cargos.map((item) => ({
      ID: item.cargo_id,
      Cargo: item.cargo_nombre ?? '',
      Descripcion: item.cargo_descripcion ?? '',
      Estado: item.cargo_estado === 'A' ? 'Activo' : 'Inactivo',
      Location: item.location?.location_name ?? '',
      'Tarifa Hora': Number(item.tarifa_hora ?? 0),
      'Tarifa Hora Extra': Number(item.tarifa_hora_extra ?? 0),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Cargos');
    XLSX.writeFile(wb, 'ges-cargos.xlsx');
  }
}
