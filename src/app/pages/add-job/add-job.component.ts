import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgFor, NgIf } from '@angular/common';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApplicationService } from 'src/app/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-add-job',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    NgFor,
    NgIf
  ],
  templateUrl: './add-job.component.html',
  styleUrl: './add-job.component.scss'
})
export class AddJobComponent {
  jobForm: FormGroup;
  isSubmitting = false;

  // Pour les chips de compétences
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  skills: string[] = [];

  locations = [
    'Dakar',
    'Saint Louis',
    'Thiès',
    'Kaolack',
    'Ziguinchor',
    'Touba',
    'Rufisque',
    'Mbour',
    'Louga',
    'Diourbel',
    'Paris',
    'Remote'
  ];

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<AddJobComponent>,
    private snackBar: MatSnackBar
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      experience: ['', [Validators.required, Validators.min(0)]],
      location: ['', [Validators.required]],
      deadline: ['', [Validators.required]]
    });
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

  onSubmit(): void {
    if (this.jobForm.invalid || this.skills.length === 0) {
      this.snackBar.open(
        'Veuillez remplir tous les champs correctement',
        'OK',
        {
          duration: 3000
        }
      );
      return;
    }

    this.isSubmitting = true;

    const jobData = {
      ...this.jobForm.value,
      skills: this.skills
    };

    this.applicationService.createJob(jobData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('Poste créé avec succès', 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erreur lors de la création du poste:', error);
        this.snackBar.open('Erreur lors de la création du poste', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
