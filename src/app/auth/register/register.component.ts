import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/User';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordMatchValidator } from 'src/app/interfaces/passwordValidators';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'vex-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    NgFor,
    MatIconModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressSpinnerModule,
  ]
})
export class RegisterComponent {
  accountFormGroup: UntypedFormGroup = this.fb.group({
    first_name: ['john', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÿ \'-]+$')]],
    last_name: ['john', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern('^[a-zA-ZÀ-ÿ \'-]+$')]],
    email: ['tekie@tekie.com', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(254),
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]],
  });

  passwordFormGroup: UntypedFormGroup = this.fb.group({
    password: [''],
    password_confirmation: ['']
  }, { validators: [passwordMatchValidator()] });

  confirmFormGroup: UntypedFormGroup = this.fb.group({
    terms: [null, Validators.requiredTrue]
  });

  successFormGroup: UntypedFormGroup = this.fb.group({ });

  passwordInputType = 'password';

  user: User | null = null;
  isLoading: boolean = false;
  errorMessage: User[] =[];
  sucess: boolean = false;
  mailmessage: string | undefined = "";

  constructor(
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
  ) { }

  showPassword() {
    this.passwordInputType = 'text';
    this.cd.markForCheck();
  }

  hidePassword() {
    this.passwordInputType = 'password';
    this.cd.markForCheck();
  }

  submit() {

    this.user = {
      first_name: this.accountFormGroup.value.first_name,
      last_name: this.accountFormGroup.value.last_name,
      email: this.accountFormGroup.value.email,
      password: this.passwordFormGroup.value.password,
      password_confirmation: this.passwordFormGroup.value.password_confirmation
    };
    this.isLoading = true;
    this.authService.register(this.user).subscribe({
      next: (responnse) => {
        this.isLoading = false;
        this.sucess = true;
        this.showMessage(responnse.message);
        this.mailmessage = responnse.mailmessage;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = [];
        this.processError(error);
      },
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
}
