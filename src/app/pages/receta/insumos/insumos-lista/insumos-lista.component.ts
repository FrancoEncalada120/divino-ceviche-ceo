import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule, Tag } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-insumos-lista',
  imports: [TableModule, Tag],
  templateUrl: './insumos-lista.component.html',
  styleUrl: './insumos-lista.component.scss',
})
export class InsumosListaComponent {
  @Input()
  insumos: Insumo[] = [];

  @Output() edit = new EventEmitter<Insumo>();

  onEdit(insumo: Insumo) {
    this.edit.emit(insumo);
  }
}
