import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta } from '../../../../core/models/receta.model';

@Component({
  selector: 'app-purchase-order-confirmation',
  imports: [],
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

  onClose() {
    console.log('Closing modal');
    this.close.emit();
  }

}
