import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserListComponent } from '../user-list/user-list.component';
import { UserUpdInsComponent } from '../user-upd-ins/user-upd-ins.component';
import { User } from '../../../core/models/user.models';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-pri',
  imports: [
    NgIf,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule,
    InputTextModule,
    UserListComponent,
    UserUpdInsComponent,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
  ],
  templateUrl: './user-pri.component.html',
  styleUrl: './user-pri.component.scss',
})
export class UserPriComponent {
  users: User[] = [];
  loading = false;
  locations: Location[] = [];
  selectedLocation!: Location[];

  constructor(
    private service: UserService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
    this.loadLocations();
  }

  load(): void {
    console.log('[Users] load() start');
    this.loading = true;

    const locationIds =
      this.selectedLocation?.map((x: any) => x.location_id) ?? [];

    this.service.getAll(locationIds).subscribe({
      next: (data) => {
        this.users = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Users] GET error:', err);
        this.loading = false;
      },
    });
  }
  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        this.selectedLocation = [...this.locations];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  loadData() {
    this.load();
  }

  // ===========================================
  // Abrel el popup
  // ===========================================

  showAddLocationModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: User | null = null;

  openCreate() {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.showAddLocationModal = true;
  }

  openEdit(user: User) {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.showAddLocationModal = true;
  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  handleSubmit(userForm: User): void {
    const isCreate = this.modalMode === 'create';

    const userData = localStorage.getItem('user');
    const currentUser = userData ? JSON.parse(userData) : null;

    const payload: any = {
      ...userForm,
    };

    if (isCreate) {
      payload.created_by = currentUser?.user_id ?? null;
    } else {
      payload.updated_by = currentUser?.user_id ?? null;
    }

    const action$ = isCreate
      ? this.service.create(payload)
      : this.service.update(payload);

    action$.subscribe({
      next: () => {
        this.load();
        this.closeModal();
      },
      error: (err) => {
        console.error('[User] save error:', err);
      },
    });
  }
}
