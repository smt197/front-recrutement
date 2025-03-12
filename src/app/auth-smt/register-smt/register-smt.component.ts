// import { ChangeDetectorRef, Component } from '@angular/core';
// import {
//   ReactiveFormsModule,
//   UntypedFormBuilder,
//   UntypedFormGroup,
//   Validators
// } from '@angular/forms';
// import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';
// import { NgIf } from '@angular/common';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { stagger80ms } from '@vex/animations/stagger.animation';
// import { scaleIn400ms } from '@vex/animations/scale-in.animation';
// import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';

// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'vex-register-smt',
//   standalone: true,
//    imports: [
//       ReactiveFormsModule,
//       MatFormFieldModule,
//       MatInputModule,
//       MatButtonModule,
//       MatTooltipModule,
//       NgIf,
//       MatIconModule,
//       MatCheckboxModule,
//       MatStepperModule,
//     ],
//     animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
//   templateUrl: './register-smt.component.html',
//   styleUrl: './register-smt.component.scss'
// })
// export class RegisterSmtComponent {
//   accountFormGroup: UntypedFormGroup = this.fb.group({
//     first_name: [null, [Validators.required, Validators.minLength(4),Validators.maxLength(50),Validators.pattern('^[a-zA-ZÀ-ÿ \'-]+$')]],
//     last_name: [null, [Validators.required, Validators.minLength(4),Validators.maxLength(50),Validators.pattern('^[a-zA-ZÀ-ÿ \'-]+$')]],
//     email: ['', [
//       Validators.required, 
//       Validators.minLength(8), 
//       Validators.maxLength(254),
//       Validators.email,
//       Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
//     ]],
//   });

//   passwordFormGroup: UntypedFormGroup = this.fb.group({
//     password: [
//       null,
//       Validators.compose([Validators.required, Validators.minLength(6)])
//     ],
//     passwordConfirm: [null, Validators.required]
//   });

//   confirmFormGroup: UntypedFormGroup = this.fb.group({
//     terms: [null, Validators.requiredTrue]
//   });

//   passwordInputType = 'password';

//   constructor(
//     private fb: UntypedFormBuilder,
//     private cd: ChangeDetectorRef,
//     private snackbar: MatSnackBar,
//     private AuthService: AuthService
//   ) {}

//   showPassword() {
//     this.passwordInputType = 'text';
//     this.cd.markForCheck();
//   }

//   hidePassword() {
//     this.passwordInputType = 'password';
//     this.cd.markForCheck();
//   }

//   // submit() {
//   //   this.snackbar.open(
//   //     'Hooray! You successfully created your account.',
//   //     undefined,
//   //     {
//   //       duration: 5000
//   //     }
//   //   );
//   // }

//   submit() {
//     if (
//       this.accountFormGroup.valid &&
//       this.passwordFormGroup.valid &&
//       this.confirmFormGroup.valid
//     ) {
//       const userData = {
//         first_name: this.accountFormGroup.value.first_name,
//         last_name: this.accountFormGroup.value.last_name,
//         email: this.accountFormGroup.value.email,
//         password: this.passwordFormGroup.value.password,
//         password_confirmation: this.passwordFormGroup.value.passwordConfirm,
//       };
  
//       this.AuthService.register(userData).subscribe({
//         next: (response) => {
//           this.snackbar.open('Inscription réussie !', 'OK', { duration: 5000 });
//         },
//         error: (error) => {
//           console.error('Erreur:', error);
//           this.snackbar.open('Erreur lors de l’inscription.', 'Fermer', { duration: 5000 });
//         },
//       });
//     }
//   }
  
// }
