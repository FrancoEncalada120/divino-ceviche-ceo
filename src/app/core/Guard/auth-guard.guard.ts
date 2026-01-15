import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('token'); // aquí puedes usar tu lógica real

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
