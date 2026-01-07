import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Location } from '../../../core/models/location.model';
import { LocationService } from '../../../core/services/location.service';
import { LocationsListComponent } from '../locations-list/locations-list.component';
import { LocationUpdInsComponent } from '../location-upd-ins/location-upd-ins.component';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-location-pri',
  imports: [NgIf, LocationsListComponent, LocationUpdInsComponent],
  templateUrl: './location-pri.component.html',
  styleUrl: './location-pri.component.scss'
})
export class LocationPriComponent {

  locations: Location[] = [];
  loading = false;

  constructor(private locationService: LocationService
    //, private toast: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');
    this.loading = true;



      this.locationService.getAll().subscribe({
        next: (data) => {
          console.log('[Locations] GET ok, items:', data?.length, data);
          this.locations = data ?? [];
          this.loading = false;
        },
        error: (err) => {
          console.error('[Locations] GET error:', err);
          this.loading = false;
        },
        complete: () => console.log('[Locations] GET complete'),
      });


  }

  // ===========================================
  // Abrel el popup
  // ===========================================

  showAddLocationModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedLocation: Location | null = null;

  openCreate() {
    this.modalMode = 'create';
    this.selectedLocation = null;
    this.showAddLocationModal = true;
  }

  openEdit(location: Location) {
    this.modalMode = 'edit';
    this.selectedLocation = location;
    this.showAddLocationModal = true;
  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  handleSubmit(location: Location) {
    const isCreate = this.modalMode === 'create';

    const action$ = isCreate
      ? this.locationService.create(location)
      : this.locationService.update(location);

    action$.subscribe({
      next: (savedLocation) => {
        console.log('[Locations] savedLocation:', savedLocation);

        if (isCreate) {
          // ➕ CREATE → agregar al array
          this.locations.push(savedLocation);
        } else {
          // ✏️ UPDATE → reemplazar en el array
          const index = this.locations.findIndex(
            l => l.location_id === savedLocation.location_id
          );

          if (index !== -1) {
            this.locations[index] = savedLocation;
          }
        }

        // this.toast.success(
        //   isCreate
        //     ? 'Location created successfully'
        //     : 'Location updated successfully'
        // );

        this.closeModal();
      },
      error: (err) => {
        //this.toast.error(err.message || 'Unexpected error');
      }
    });
  }


}
