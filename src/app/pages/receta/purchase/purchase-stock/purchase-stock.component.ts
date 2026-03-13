import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-purchase-stock',
  imports: [NgFor, CardModule, TagModule],
  templateUrl: './purchase-stock.component.html',
  styleUrl: './purchase-stock.component.scss'
})
export class PurchaseStockComponent {

  stockBajo = [
    {
      id: 1,
      nombre: 'Azúcar',
      stock: 5,
      stockMin: 20
    },
    {
      id: 2,
      nombre: 'Arroz',
      stock: 8,
      stockMin: 25
    },
    {
      id: 3,
      nombre: 'Leche',
      stock: 3,
      stockMin: 15
    },
    {
      id: 4,
      nombre: 'Aceite',
      stock: 2,
      stockMin: 10
    }
  ];

}
