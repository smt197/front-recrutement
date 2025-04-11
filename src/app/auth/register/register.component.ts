import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
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
import { User } from 'src/app/interfaces/User';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/services/auth-service';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
    MatChipsModule
  ]
})
export class RegisterComponent {
  registerForm: UntypedFormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50),
        Validators.pattern("^[a-zA-ZÀ-ÿ '-]+$")
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(254),
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        )
      ]
    ],
    experience: ['', [Validators.required, this.nonNegativeIntegerValidator]],
    skills: ['', [Validators.required]]
  });

  passwordInputType = 'password';
  isLoading: boolean = false;
  errorMessage: string[] = [];
  success: boolean = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  nonNegativeIntegerValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (isNaN(value) || value < 0 || !Number.isInteger(Number(value))) {
      return { nonNegativeInteger: true };
    }
    return null;
  }

  showPassword() {
    this.passwordInputType = 'text';
    this.cd.markForCheck();
  }

  hidePassword() {
    this.passwordInputType = 'password';
    this.cd.markForCheck();
  }

  submit() {
    if (this.registerForm.invalid || this.skills.length === 0) {
      return;
    }

    this.isLoading = true;
    const userData = {
      ...this.registerForm.value,
      experience: parseInt(this.registerForm.value.experience, 10),
      skills: this.skills
    };

    // Log des données avant l'envoi
    console.log('Données envoyées :', userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log(userData), (this.isLoading = false);
        this.success = true;
        this.showMessage(response.message || 'Inscription réussie');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.processError(error);
      }
    });
  }

  private processError(response: HttpErrorResponse): void {
    this.errorMessage = [];
    if (response.status === 400 || response.status === 422) {
      if (response.error.errors) {
        // Gestion des erreurs de validation
        for (const key in response.error.errors) {
          if (response.error.errors.hasOwnProperty(key)) {
            this.errorMessage.push(...response.error.errors[key]);
          }
        }
      } else if (response.error.message) {
        // Gestion des messages d'erreur généraux
        this.errorMessage.push(response.error.message);
      }
    } else {
      this.errorMessage.push('Une erreur inattendue est survenue');
    }
  }

  showMessage(message: string) {
    this.snackbar.open(message, 'Fermer', { duration: 10000 });
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.skills.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }
}
