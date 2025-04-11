import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { Application } from 'src/app/interfaces/application';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth-service';
import { FormsModule } from '@angular/forms'; // Ajoutez ceci
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDetailsComponent } from '../application-details/application-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Job } from 'src/app/interfaces/job';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { AddJobComponent } from '../add-job/add-job.component';
import { EditJobComponent } from '../edit-job/edit-job.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { MatChipsModule } from '@angular/material/chips';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'vex-jobs',
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    NgIf,
    NgFor,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TruncatePipe,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JobsComponent {
  jobs: any[] = [];
  user: any = null;

  displayedColumns: string[] = [
    'title',
    'description',
    'experience',
    'skills',
    'location',
    'deadline',
    'createdAt',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  selectedJobTitle: string = '';
  jobTitles: string[] = [];
  paginationMeta: any = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      this.loadJobs();
    });
  }

  loadJobs(page: number = 1, search?: string) {
    this.isLoading = true;
    const limit = 10;

    this.applicationService.getAllJobs(page, limit, search).subscribe({
      next: (response) => {
        this.jobs = response.data;
        this.dataSource.data = this.prepareJobDataSource(response.data);
        this.paginationMeta = response.meta;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        // this.snackBar.open('Erreur lors du chargement des postes', 'Fermer', {
        //   duration: 3000
        // });
        this.isLoading = false;
      }
    });
  }

  prepareJobDataSource(jobs: Job[]): any[] {
    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      experience: job.experience,
      skills: job.skills.join(', '),
      location: job.location,
      deadline: new Date(job.deadline).toLocaleDateString(),
      recruiterId: job.recruiterId,
      createdAt: new Date(job.createdAt).toLocaleDateString(),
      updatedAt: new Date(job.updatedAt).toLocaleDateString()
    }));
  }

  onPageChange(event: PageEvent) {
    this.loadJobs(event.pageIndex + 1); // +1 car pageIndex commence à 0
  }

  // Pour la recherche
  onSearch(searchTerm: string) {
    this.loadJobs(1, searchTerm); // Retour à la première page avec le nouveau terme
  }

  openAddJobDialog() {
    const dialogRef = this.dialog.open(AddJobComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si le résultat est true, cela signifie que le poste a été créé
        this.loadJobs(); // Recharge la liste des postes
      }
    });
  }

  openEditJobDialog(jobId: number): void {
    const dialogRef = this.dialog.open(EditJobComponent, {
      width: '600px',
      data: { jobId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadJobs(); // Recharger les postes après la mise à jour
      }
    });
  }

  confirmDeleteJob(jobId: number): void {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer ce poste ? Cette action est irréversible.'
      )
    ) {
      this.deleteJob(jobId);
    }
  }

  deleteJob(jobId: number): void {
    this.isLoading = true;
    this.applicationService.deleteJob(jobId).subscribe({
      next: () => {
        this.snackBar.open('Poste supprimé avec succès', 'Fermer', {
          duration: 3000
        });
        this.loadJobs(); // Recharger les postes
      },
      error: (error) => {
        console.error('Error deleting job:', error);
        this.snackBar.open('Erreur lors de la suppression du poste', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  viewJobDetails(jobId: number): void {
    this.dialog.open(JobDetailsComponent, {
      width: '700px',
      data: { jobId }
    });
  }
}
