import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { passwordMatchValidatorLogin } from 'src/app/interfaces/passwordValidators';
import { AuthService } from 'src/app/services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { credentialsFormLogin } from 'src/app/interfaces/Credentials-form-login';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,

  ]
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: ["", [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(254),
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]],
    remember_me: [false],
    password: [''],
    password_confirmation: ['']
  }, {
    validators: [passwordMatchValidatorLogin()]
  });

  inputType = 'password';
  visible = false;
  isLoading: boolean = false;
  errorMessage: string[] = [];
  sucess: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {

  }

  send() {
    this.isLoading = true;
    const form: credentialsFormLogin = {
      email: this.form.value.email ?? "",
      password: this.form.value.password ?? "",
      remember_me: this.form.value.remember_me ?? false,
    }
    this.authService.login(form).subscribe({
      next: (response) => {
        this.showMessage(response.message);
        this.isLoading = false;
        this.router.navigate(['/index']);
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage(error.error.message);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });

  }

  private processError(response: HttpErrorResponse): void {
    this.errorMessage = [];
    if (response.status === 400 || response.status === 422) {
      this.errorMessage.push(response.error.errors)
    }
  }

  showMessage(params: string | undefined) {
    if (params) {
      this.snackbar.open(params, "Fermer", { duration: 10000 });
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
