import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Location } from '../../../core/models/location.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-location-upd-ins',
  imports: [
    CommonModule,
    FormsModule   // 👈 OBLIGATORIO para ngModel
  ],
  templateUrl: './location-upd-ins.component.html',
  styleUrl: './location-upd-ins.component.scss'
})
export class LocationUpdInsComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Location>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() location: Location | null = null;

  formData: Location = {
    location_id: 0,
    location_name: '',
    location_AccountNumber: '',
    location_status: ''
  };

  ngOnInit() {
    if (this.mode === 'edit' && this.location) {
      // Copia defensiva (muy importante)
      this.formData = { ...this.location };
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData);
  }

}
