import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Receta } from '../../../../core/models/receta.model';
import { RecetaService } from '../../../../core/services/receta.service';

@Component({
  selector: 'app-insumos-receta',
  imports: [CommonModule, CardModule, TagModule, ProgressSpinnerModule],
  templateUrl: './insumos-receta.component.html',
  styleUrl: './insumos-receta.component.scss',
})
export class InsumosRecetaComponent implements OnChanges {
  @Input() insumoId: number | null = null;

  recetas: Receta[] = [];
  loading = false;
  errorMessage = '';

  constructor(private recetaService: RecetaService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insumoId']) {
      this.loadRecetas();
    }
  }

  loadRecetas(): void {
    this.recetas = [];
    this.errorMessage = '';

    if (!this.insumoId) return;

    this.loading = true;

    this.recetaService.getByInsumoId(this.insumoId).subscribe({
      next: (data) => {
        this.recetas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('[RecetasByInsumo] error:', err);
        this.errorMessage = 'No se pudieron cargar las recetas';
        this.loading = false;
      },
    });
  }

  getEstadoSeverity(
    estado?: string,
  ): 'success' | 'danger' | 'warning' | 'info' {
    if (estado === 'A') return 'success';
    if (estado === 'I') return 'danger';
    return 'warning';
  }

  getEstadoLabel(estado?: string): string {
    if (estado === 'A') return 'Activo';
    if (estado === 'I') return 'Inactivo';
    return estado || 'Sin estado';
  }

  trackByReceta(index: number, item: Receta): number {
    return item.receta_id;
  }
}
