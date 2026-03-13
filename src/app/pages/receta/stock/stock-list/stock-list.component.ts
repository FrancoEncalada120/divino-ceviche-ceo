import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { InsumoService } from '../../../../core/services/insumo.service';

@Component({
  selector: 'app-stock-list',
  imports: [NgFor, CardModule, TagModule, NgClass],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent implements OnInit {

  insumos: Insumo[] = [];

  constructor(private insumoService: InsumoService) {


  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');


    this.insumoService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.insumos = data ?? [];

        this.insumos = (data ?? [])
          //.filter(i => i.stock < i.stock_ideal)
          .sort((a, b) => (b.stock_ideal - b.stock) - (a.stock_ideal - a.stock));


      },
      error: (err) => {
        console.error('[Locations] GET error:', err);

      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

}
