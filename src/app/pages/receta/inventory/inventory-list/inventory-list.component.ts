import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Inventario } from '../../../../core/models/inventory.model';
import { Insumo } from '../../../../core/models/insumo.model';


@Component({
  selector: 'app-inventory-list',
  imports: [TableModule, CommonModule],
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss'
})
export class InventoryListComponent {

  @Input()
  inventoryList: Inventario[] = [];

  @Input()
  insumo: Insumo | null = null;


  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  getColorPrice(i: number): string {

    if (i == 0)
      return '';

    console.log('Comparando precios para index:', i);

    let insumo1 = this.inventoryList[i];
    let insumo2 = this.inventoryList[i - 1];
    let diff = insumo1.precio - insumo2.precio;

    if (diff > 0)
      return 'text-green-500';
    else if (diff < 0)
      return 'text-red-500';
    else
      return '';


  }

  getIconClassPrice(i: number): string {

    if (i == 0)
      return 'text-green-500';

    console.log('Comparando precios para index:', i);

    let insumo1 = this.inventoryList[i];
    let insumo2 = this.inventoryList[i - 1];
    let diff = insumo1.precio - insumo2.precio;

    if (diff > 0)
      return `pi pi-arrow-up ${this.getColorPrice(i)}`;
    else if (diff < 0)
       return `pi pi-arrow-down ${this.getColorPrice(i)}`;
    else
      return 'pi pi-arrows-h';


  }

  getColor(desc: string): string {
    switch (desc) {
      case '1':
        return 'text-green-500';
      case '2':
        return 'text-red-500';
      case '3':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }

  getIconClass(desc: string): string {
    switch (desc) {
      case '1':
        return `pi pi-arrow-up ${this.getColor(desc)}`;
      case '2':
        return `pi pi-arrow-down ${this.getColor(desc)}`;
      case '3':
        return `pi pi-arrow-up ${this.getColor(desc)}`;
      default:
        return `pi pi-minus ${this.getColor(desc)}`;
    }
  }

  getDesc(desc: string, compra_id: string = ""): string {
    switch (desc) {
      case '1':
        return '(+) Actualización del insumo';
      case '2':
        return '(-) Actualización del insumo';
      case '3':
        return 'ID de Compra: ' + compra_id;
      default:
        return desc || '-';
    }
  }

}
