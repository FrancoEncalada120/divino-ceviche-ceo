import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta } from '../../../../core/models/receta.model';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-order-confirmation',
  imports: [NgFor, NgIf, TxtsignoPipe],
  templateUrl: './purchase-order-confirmation.component.html',
  styleUrl: './purchase-order-confirmation.component.scss'
})
export class PurchaseOrderConfirmationComponent {

  @Output() close = new EventEmitter<void>();

  @Input()
  recetas_impactadas: Receta[] = [];

  @Input()
  txtSummary: string = '';

  @Input()
  txtDetail: string = '';

  @Input()
  isOrder: boolean = false;


  onClose() {
    console.log('Closing modal');
    this.close.emit();
  }

}
