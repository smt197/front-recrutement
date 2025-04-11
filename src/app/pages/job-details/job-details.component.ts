import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ApplicationService } from 'src/app/services/application.service';
import { Job } from 'src/app/interfaces/job';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vex-job-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {
  job: Job | null = null;
  isLoading = true;
  error = false;

  constructor(
    private applicationService: ApplicationService,
    private dialogRef: MatDialogRef<JobDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: number }
  ) {}

  ngOnInit(): void {
    this.loadJobDetails();
  }

  loadJobDetails(): void {
    this.isLoading = true;
    this.applicationService.getJobById(this.data.jobId).subscribe({
      next: (jobData) => {
        this.job = jobData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading job details:', error);
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
