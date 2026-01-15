import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';

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

  lblerror: string = '';
  berror: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // 🚧 Por ahora solo navegación (sin API)
    this.isSubmitting = true;
    this.berror = false;


    this.userService.login(this.email, this.password).subscribe({
      next: res => {
        console.log('Token:', res.token);
        console.log('Usuario:', res.user);


        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // simula un pequeño delay visual (opcional)
        setTimeout(() => {
          this.isSubmitting = false;
          this.router.navigate(['CEO/dashboard']);
        }, 300);


      },
      error: err => {
        console.error('Login error', err);
        this.lblerror = err.error.mensaje
        this.berror = true;
        this.isSubmitting = false;
      }
    });


  }
}
