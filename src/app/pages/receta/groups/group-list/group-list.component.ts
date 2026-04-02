import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecConversion } from '../../../../core/models/conversion.model';

@Component({
  selector: 'app-group-list',
  imports: [CommonModule, TableModule, TabViewModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
})
export class GroupsListComponent {
  @Input() conversiones: RecConversion[] = [];

  @Output() edit = new EventEmitter<RecConversion>();
  @Output() remove = new EventEmitter<RecConversion>();

  onEdit(conversion: RecConversion): void {
    this.edit.emit(conversion);
  }

  onDelete(conversion: RecConversion): void {
    this.remove.emit(conversion);
  }

  Number(v: any): number {
    return Number(v ?? 0);
  }
}
