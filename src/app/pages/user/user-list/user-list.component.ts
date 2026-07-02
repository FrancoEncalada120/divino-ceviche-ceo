import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../core/models/user.models';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  imports: [TableModule, ButtonModule, TagModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @Input()
  users: User[] = [];

  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();

  onEdit(goal: User) {
    this.edit.emit(goal);
  }

  exportExcel() {
    const rows = this.users.map((item) => ({
      ID: item.user_id,
      Nombre: item.user_name ?? '',
      Apellido: item.user_apellido ?? '',
      Email: item.user_email ?? '',
      Telefono: item.user_telefono ?? '',
      Documento: item.user_documento ?? '',
      Direccion: item.user_direccion ?? '',
      FechaIngreso: item.user_fecha_ingreso ?? '',
      CodigoExterno: item.ext_code ?? '',
      CargoId: item.cargo_id ?? '',
      Estado: item.user_estado === 'A' ? 'Activo' : 'Inactivo',
      Rol:
        item.user_rol == 1 ? 'SYSTEM' : item.user_rol == 2 ? 'ADMIN' : 'USER',
      Location: item.location?.location_name ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }
}
