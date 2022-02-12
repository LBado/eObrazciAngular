import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const helper = new JwtHelperService();
    //če že obstaja preverimo čas
    if (localStorage.getItem('authToken')) {
      const token = localStorage.getItem('authToken');
      const decodedToken = helper.decodeToken(token!);

      const nowTime = Date.now();
      console.log(nowTime);
      console.log(decodedToken.exp);
      if (nowTime >= decodedToken.exp * 1000) {
        //expired token
        console.log(token);
        localStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
