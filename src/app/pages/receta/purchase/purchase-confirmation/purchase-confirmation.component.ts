import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receta } from '../../../../core/models/receta.model';
import { TxtsignoPipe } from '../../../../core/pipes/txtsigno.pipe';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-purchase-confirmation',
  imports: [NgFor, NgIf, TxtsignoPipe],
  templateUrl: './purchase-confirmation.component.html',
  styleUrl: './purchase-confirmation.component.scss'
})
export class PurchaseConfirmationComponent {

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
