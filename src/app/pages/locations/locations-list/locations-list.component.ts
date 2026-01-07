import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '../../../core/models/location.model';


@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'], // ✅ era styleUrl
})
export class LocationsListComponent {

  @Input()
  locations: Location[] = [];

  @Output() edit = new EventEmitter<Location>();

  onEdit(location: Location) {

    this.edit.emit(location);
  }

}
