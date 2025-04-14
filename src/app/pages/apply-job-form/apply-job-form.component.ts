import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationService } from 'src/app/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'vex-apply-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './apply-job-form.component.html',
  styleUrl: './apply-job-form.component.scss'
})
export class ApplyJobFormComponent implements OnInit {
  applicationForm!: FormGroup;
  isSubmitting = false;

  // Pour l'affichage des noms de fichiers
  cvFileName = '';
  coverLetterFileName = '';
  portfolioFileName = '';

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ApplyJobFormComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: number; jobTitle: string }
  ) {}

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      cv: [null, Validators.required],
      coverLetter: [null],
      portfolio: [null],
      consentGiven: [false, Validators.requiredTrue]
    });
  }

  onCvFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.applicationForm.patchValue({ cv: file });
      this.cvFileName = file.name;
    }
  }

  onCoverLetterFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.applicationForm.patchValue({ coverLetter: file });
      this.coverLetterFileName = file.name;
    }
  }

  onPortfolioFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.applicationForm.patchValue({ portfolio: file });
      this.portfolioFileName = file.name;
    }
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('jobId', this.data.jobId.toString());

    formData.append(
      'consentGiven',
      this.applicationForm.get('consentGiven')!.value
    );

    // Ajout des fichiers
    if (this.applicationForm.get('cv')!.value) {
      formData.append('cv', this.applicationForm.get('cv')!.value);
    }

    if (this.applicationForm.get('coverLetter')!.value) {
      formData.append(
        'coverLetter',
        this.applicationForm.get('coverLetter')!.value
      );
    }

    if (this.applicationForm.get('portfolio')!.value) {
      formData.append(
        'portfolio',
        this.applicationForm.get('portfolio')!.value
      );
    }

    this.applicationService.submitApplication(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('Candidature soumise avec succès', 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.showMessage('La date limite de candidature est dépassée');
        this.isSubmitting = false;
      }
    });
  }

  showMessage(params: string | undefined) {
    if (params) {
      this.snackbar.open(params, 'Fermer', { duration: 10000 });
    }
  }
}
