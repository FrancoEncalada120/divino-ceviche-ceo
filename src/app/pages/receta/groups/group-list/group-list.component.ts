import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Grupo } from '../../../../core/models/grupos.model';

@Component({
  selector: 'app-group-list',
  imports: [CommonModule, TableModule, TabViewModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
})
export class GroupsListComponent {
  @Input() conversiones: Grupo[] = [];

  @Output() edit = new EventEmitter<Grupo>();
  @Output() remove = new EventEmitter<Grupo>();

  onEdit(conversion: Grupo): void {
    this.edit.emit(conversion);
  }

  onDelete(conversion: Grupo): void {
    this.remove.emit(conversion);
  }

  Number(v: any): number {
    return Number(v ?? 0);
  }
}
