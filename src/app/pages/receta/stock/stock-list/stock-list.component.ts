import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Insumo } from '../../../../core/models/insumo.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InventoryListComponent } from "../../inventory/inventory-list/inventory-list.component";
import { InventoryService } from '../../../../core/services/inventory.service';


@Component({
  selector: 'app-stock-list',
  imports: [FormsModule, CardModule, TagModule, NgClass, TableModule, InventoryListComponent, NgIf],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.scss'
})
export class StockListComponent implements OnInit {

  insumos: Insumo[] = [];
  insumoInventory: Insumo | null = null;

  private searchSubject = new Subject<string>();
  searchText: string = '';

  constructor(private insumoService: InsumoService, private inventoryService: InventoryService) {


  }

  ngOnInit(): void {

    this.load();

    this.searchSubject.pipe(
      debounceTime(1000),          // ⏱ espera 1 segundo
      filter(text => text.length >= 3 || text.length === 0) // 🔎 mínimo 3 letras
    ).subscribe(text => {
      this.searchText = text;
      this.load();
    });

  }

  load(): void {

    console.log('[Locations] load() start');
    console.log('Buscando:', this.searchText);

    this.insumoService.getAll({
      text: this.searchText, // string
    }).subscribe({
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

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  showInventoryModal = false;
  inventoryList: any[] = [];

  closeModal() {
    this.showInventoryModal = false;
  }

  mostrarPopupKardex(insumo_id: number, insumo: Insumo) {

    this.inventoryList = [];
    this.insumoInventory = insumo

    this.inventoryService.getAll({
      insumo_id: insumo_id, // string
    }).subscribe({
      next: (data) => {

        this.inventoryList = data ?? [];
        this.showInventoryModal = true;
      },
      error: (err) => {
        console.error('[inventoryService.getAll] GET error:', err);

      },
      complete: () => console.log('[inventoryService.getAll] GET complete'),
    });


  }

}
