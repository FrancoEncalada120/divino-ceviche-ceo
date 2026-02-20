import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Receta } from '../../../../core/models/receta.model';
import { CommonModule, NgIf } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, TreeTableModule, ButtonModule, TagModule],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.scss',
  standalone: true,
})
export class RecipeListComponent {
  @Input() recetas: Receta[] = [];

  @Output() edit = new EventEmitter<Receta>();

  nodes: TreeNode[] = [];

  expandedKeys: Record<string, boolean> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recetas']) {
      this.nodes = (this.recetas || []).map((r) => ({
        key: String(r.receta_id),
        data: {
          type: 'recipe',
          receta: r,
        },
        children: (r.detalles || []).map((d, idx) => ({
          key: `${r.receta_id}-${idx}`,
          data: {
            type: 'detail',
            detalle: d,
          },
          leaf: true,
        })),
      }));
    }
  }

  onEdit(receta: Receta) {
    this.edit.emit(receta);
  }

  // opcional: por si quieres controlar expand/colapse manualmente
  onNodeExpand(event: any) {
    const key = event?.node?.key;
    if (key) this.expandedKeys[key] = true;
  }

  onNodeCollapse(event: any) {
    const key = event?.node?.key;
    if (key) delete this.expandedKeys[key];
  }

  Number(v: any): number {
    return Number(v ?? 0);
  }
}
