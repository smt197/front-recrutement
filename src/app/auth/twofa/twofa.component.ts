import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'vex-twofa',
  standalone: true,
  imports: [
    RouterLink,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgIf,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './twofa.component.html',
  styleUrl: './twofa.component.scss'
})
export class TwofaComponent implements OnInit {

    private apiUrl = environment.apiUrl;
    qrCodeImage: string | null = null;

  form = this.fb.group({
    token: ['', Validators.required]
  });

  isLoading = false;

  constructor(
    private http: HttpClient, private router: Router, private snackbar: MatSnackBar, private fb: FormBuilder,
  ) {}


  ngOnInit(): void {
    const tempToken = localStorage.getItem('temp_token');

    this.http.get<any>(`${environment.apiUrl}/auth/temp-info`, {
      headers: { Authorization: `Bearer ${tempToken}` }
    }).subscribe({
      next: (res) => {
        this.qrCodeImage = res.qrCode;
      },
      error: () => {
        this.snackbar.open('Erreur de chargement du QR code', 'Fermer', { duration: 3000 });
      }
    });
  }

  verify2FA() {
    const token = this.form.value.token;
    const tempToken = localStorage.getItem('temp_token');

    this.isLoading = true;
    this.http.post<any>(`${this.apiUrl}/auth/verify-2fa`, { token }, {
      headers: { Authorization: `Bearer ${tempToken}` }
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.removeItem('temp_token');
        localStorage.setItem('jwt_token', res.access_token); // tu renvoies l'access_token ici
        this.router.navigate(['index']); // ou une autre route protégée
      },
      error: (err) => {
        this.isLoading = false;
        this.snackbar.open(err?.error?.message || 'Invalid 2FA token', 'Fermer', { duration: 3000 });
      }
    });
  }

}
