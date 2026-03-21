import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecConversion } from '../../../../core/models/conversion.model';

@Component({
  selector: 'app-conversion-list',
  imports: [CommonModule, TableModule, TabViewModule],
  templateUrl: './conversion-list.component.html',
  styleUrl: './conversion-list.component.scss',
})
export class ConversionListComponent {
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
