import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule, Tag } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-insumos-lista',
  imports: [TableModule, Tag, InputTextModule],
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
  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }
}
