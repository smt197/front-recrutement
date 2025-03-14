import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from 'src/app/services/auth-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UserForgotPassword } from 'src/app/interfaces/User-forgot-password';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatSnackBarModule,
  ]
})
export class ForgotPasswordComponent implements OnInit {
  form = this.fb.group({
    email: ["", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(254),
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]],
  });
  email: UserForgotPassword | null = null;
  isLoading: boolean = false;
  sucess: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() { }

  send() {
    this.email = {
      email: this.form.value.email ?? "",
    }
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log(response);
        
        this.showMessage(response.message);
        this.isLoading = false;
        this.sucess = true;
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage(error.error.message);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });

  }

  showMessage(params: string | undefined) {
    if (params) {
      this.snackbar.open(params, "Fermer", { duration: 10000 });
    }
  }

}
