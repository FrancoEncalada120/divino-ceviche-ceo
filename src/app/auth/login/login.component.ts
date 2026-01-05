import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = 'info@divinoceviche.com';
  password = '';
  showPassword = false;
  isSubmitting = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // 🚧 Por ahora solo navegación (sin API)
    this.isSubmitting = true;

    // simula un pequeño delay visual (opcional)
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/menu']);
    }, 300);
  }
}
