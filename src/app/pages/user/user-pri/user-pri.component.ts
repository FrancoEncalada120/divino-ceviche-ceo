import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { UserListComponent } from "../user-list/user-list.component";
import { UserUpdInsComponent } from "../user-upd-ins/user-upd-ins.component";
import { User } from '../../../core/models/user.models';


@Component({
  selector: 'app-user-pri',
  imports: [NgIf, UserListComponent, UserUpdInsComponent],
  templateUrl: './user-pri.component.html',
  styleUrl: './user-pri.component.scss'
})
export class UserPriComponent {

  users: User[] = [];
  loading = false;

  constructor(private service: UserService
    //, private toast: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');
    this.loading = true;

    this.service.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.users = data ?? [];
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

  handleSubmit(goal: User) {
    const isCreate = this.modalMode === 'create';

    const action$ = isCreate
      ? this.service.create(goal)
      : this.service.update(goal);

    action$.subscribe({
      next: (saved) => {
        console.log('[User] saveduser', saved);

        if (isCreate) {
          // ➕ CREATE → agregar al array
          this.users.push(saved);
        } else {
          // ✏️ UPDATE → reemplazar en el array
          const index = this.users.findIndex(
            l => l.user_id === saved.user_id
          );

          if (index !== -1) {
            this.users[index] = saved;
          }
        }

        this.closeModal();
      },
      error: (err) => {
        console.error('[Locations] save error:', err);
      }
    });
  }

}
