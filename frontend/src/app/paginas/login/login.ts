import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatLabel } from "@angular/material/form-field";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatLabel, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {


  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    const { email, password } = this.loginForm.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (resp) => {
        console.log('Login successful', resp);
        this.router.navigate(['/main']);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

}
