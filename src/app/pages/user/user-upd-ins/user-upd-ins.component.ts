import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.models';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';


@Component({
  selector: 'app-user-upd-ins',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-upd-ins.component.html',
  styleUrl: './user-upd-ins.component.scss'
})
export class UserUpdInsComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<User>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user: User | null = null;

  locations: Location[] = [];


  constructor(private locationService: LocationService) { }

  formData: User = {
    user_apellido: '',
    user_email: '',
    user_estado: 'A',
    user_id: 0,
    user_name: '',
    user_password: '',
    user_rol: 3,
    location_id: 0,
    location: {
      location_AccountNumber: "",
      location_id: 0,
      location_name: "",
      location_status: "",
    }
  };

  ngOnInit() {

    console.log('UserUpdInsComponent initialized with mode:', this.mode, 'and user:', this.user);

    this.loadLocations();
    if (this.mode === 'edit' && this.user) {

      this.formData = { ...this.user };
      console.log('this.formData', this.formData);
    } else {

      const userData = localStorage.getItem('user');
      const user: User | null = userData ? (JSON.parse(userData) as User) : null;
      this.formData.location_id = user?.location_id ?? 0;

    }




  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {

    this.submit.emit(this.formData);
  }

  loadLocations(): void {

    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });

  }


}
