import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Insumo } from '../../../../core/models/insumo.model';

@Component({
  selector: 'app-insumos-lista',
  imports: [],
  templateUrl: './insumos-lista.component.html',
  styleUrl: './insumos-lista.component.scss',
})
export class InsumosListaComponent {
  @Input()
  insumo: Insumo[] = [];

  @Output() edit = new EventEmitter<Insumo>();

  onEdit(insumo: Insumo) {
    this.edit.emit(insumo);
  }
}
