import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.models';


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

  constructor() { }

  formData: User = {
    user_apellido: '',
    user_email: '',
    user_estado: 'A',
    user_id: 0,
    user_name: '',
    user_password: '',
    user_rol: 3
  };

  ngOnInit() {

    if (this.mode === 'edit' && this.user) {

      this.formData = { ...this.user };

      console.log('this.formData', this.formData);
    }



  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {

    this.submit.emit(this.formData);
  }


}
