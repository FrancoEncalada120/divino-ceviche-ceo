import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../core/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmNewPassword = group.get('confirmNewPassword')?.value;

  if (!newPassword || !confirmNewPassword) return null;
  return newPassword === confirmNewPassword
    ? null
    : { passwordsMismatch: true };
}

@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
  ],
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);

  @Input() userId!: number;

  // Para abrir/cerrar desde el padre: [(visible)]="show"
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  // Para que el padre haga refresh
  @Output() changed = new EventEmitter<void>();

  loading = false;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: matchPasswords },
  );
  close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.loading = false;
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Falta userId.',
      });
      return;
    }

    const currentPassword = this.form.value.currentPassword!;
    const newPassword = this.form.value.newPassword!;

    this.loading = true;

    this.userService
      .changePassword(this.userId, { currentPassword, newPassword })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Listo',
            detail: 'Contraseña actualizada.',
          });
          this.changed.emit();
          this.close();
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.error?.mensaje ||
            'No se pudo cambiar la contraseña.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: msg,
          });
          this.loading = false;
        },
      });
  }

  isInvalid(name: 'currentPassword' | 'newPassword' | 'confirmNewPassword') {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
}
