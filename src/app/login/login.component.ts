import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  isRegistered: boolean = false;
  registerButton: string = 'Registracija';
  ngOnInit(): void {

  }



  register() {
    let failAlert = document.getElementById('login-fail-alert');
    if (this.username.trim().length <= 0 || this.password.trim().length <= 0) {
      this.errorMessage = 'Polja ne smejo biti prazna!';
      failAlert!.style.display = 'block';
      setTimeout(function () {
        failAlert!.style.display = 'none';
      }, 3000);
    }

    this.authService.register(this.username, this.password).subscribe(
      (data) => {
        this.isRegistered = true;
        this.registerButton = 'Registracija uspela';
      },
      (error) => {
        this.errorMessage = 'Nekaj je šlo narobe';
        failAlert!.style.display = 'block';
        setTimeout(function () {
          failAlert!.style.display = 'none';
        }, 3000);
      }
    );
  }

  login() {
    let failAlert = document.getElementById('login-fail-alert');
    if (this.username.trim().length <= 0 || this.password.trim().length <= 0) {
      this.errorMessage = 'Polja ne smejo biti prazna!';
      failAlert!.style.display = 'block';
      setTimeout(function () {
        failAlert!.style.display = 'none';
      }, 3000);
    }

    this.authService.login(this.username, this.password).subscribe(
      (data) => {
        console.log(data);
        // if (data) {
        //   console.log(data);
        localStorage.setItem('authToken', data);
        this.router.navigate(['/obrazci']);
        // } else {
        //   localStorage.clear();
        //   this.errorMessage = 'Nepravilno geslo!';
        //   failAlert!.style.display = 'block';
        //   setTimeout(function () {
        //     failAlert!.style.display = 'none';
        //   }, 3000);
        // }
      },
      (error) => {
        if (error.status === 404) {
          localStorage.clear();
          this.errorMessage = 'Ta uporabnik ne obstaja!';
          failAlert!.style.display = 'block';
          setTimeout(function () {
            failAlert!.style.display = 'none';
          }, 3000);
        }
        if (error.status === 400) {
          localStorage.clear();
          this.errorMessage = 'Nepravilno geslo!';
          failAlert!.style.display = 'block';
          setTimeout(function () {
            failAlert!.style.display = 'none';
          }, 3000);
        }
      }
    );
  }
}
