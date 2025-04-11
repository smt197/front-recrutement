import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from '@angular/material/dialog';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Job } from 'src/app/interfaces/job';

@Component({
  selector: 'vex-edit-job',
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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgFor,
    NgIf
  ],
  templateUrl: './edit-job.component.html',
  styleUrl: './edit-job.component.scss'
})
export class EditJobComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitting = false;
  isLoading = true;

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
    private dialogRef: MatDialogRef<EditJobComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: number }
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      experience: ['', [Validators.required, Validators.min(0)]],
      location: ['', [Validators.required]],
      deadline: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadJobDetails();
  }

  loadJobDetails(): void {
    this.applicationService.getJobById(this.data.jobId).subscribe(
      (job: Job) => {
        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          experience: job.experience,
          location: job.location,
          deadline: new Date(job.deadline)
        });
        this.skills = job.skills || [];
        this.isLoading = false;
      },
      (error: unknown) => {
        console.error('Error loading job details:', error);
        this.snackBar.open(
          'Erreur lors du chargement des détails du poste',
          'Fermer',
          {
            duration: 3000
          }
        );
        this.isLoading = false;
        this.dialogRef.close(false);
      }
    );
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

    this.applicationService.updateJob(this.data.jobId, jobData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('Poste mis à jour avec succès', 'OK', {
          duration: 3000
        });
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating job:', error);
        this.snackBar.open('Erreur lors de la mise à jour du poste', 'Fermer', {
          duration: 3000
        });
        this.isSubmitting = false;
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
