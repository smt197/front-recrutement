import { CommonModule, NgFor, NgIf } from '@angular/common';
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
import { MatMenuModule } from '@angular/material/menu';
import { PaginatedApplicationResponseDto } from 'src/app/interfaces/PaginateResponse';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
    MatMenuModule,
    CommonModule
  ]
})
export class DashboardComponent implements OnInit {
  user: any = null;
  applications: any[] = [];
  displayedColumns: string[] = ['candidate', 'job', 'status', 'details'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  selectedJobTitle: string = '';
  jobTitles: string[] = [];
  jobs: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      if (user?.role === 'RECRUTEUR') {
        this.displayedColumns = [
          'candidate',
          'job',
          'status',
          'actions',
          'details'
        ];
        this.loadApplications();
        this.loadJobTitles();
      } else if (user?.role === 'CANDIDATE') {
        this.displayedColumns = ['job', 'status', 'details'];
        console.log('Loading my applications');
        this.loadMyApplications();
      }
    });
  }

  loadJobTitles() {
    this.applicationService.getAllJobTitles().subscribe({
      next: (titles) => {
        this.jobTitles = titles;
      },
      error: (err) => console.error('Failed to load job titles', err)
    });
  }

  onJobSelected() {
    if (this.selectedJobTitle) {
      // this.loadApplicationsByJob(this.selectedJobTitle);
      this.loadApplicationsByJobTitle(this.selectedJobTitle);
    }
  }

  loadApplications() {
    this.isLoading = true;
    this.applicationService
      .getApplications(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.applications = response.data;
          this.dataSource.data = this.prepareDataSource(response.data);
          this.totalItems = response.meta.total;
          this.isLoading = true;
        },
        error: (error) => console.error(error),
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  prepareDataSources(applications: Application[]): Application[] {
    return applications.map((app) => ({
      ...app,
      appliedDate: new Date(app.createdAt).toLocaleDateString()
    }));
  }

  loadMyApplications() {
    this.isLoading = true;
    this.applicationService
      .getMyApplications(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: PaginatedApplicationResponseDto) => {
          this.applications = response.applications;
          this.dataSource.data = this.prepareDataSources(response.applications);
          console.log('My applications:', this.dataSource.data);
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading my applications:', error);
          this.snackBar.open('Failed to load applications', 'Close', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }
  prepareDataSource(applications: Application[]): any[] {
    return applications.map((app) => ({
      candidate: app.candidate.name,
      job: app.job.title,
      status: app.status,
      id: app.id,
      email: app.candidate.email,
      cvUrl: app.cvUrl,
      coverLetterUrl: app.coverLetterUrl,
      portfolioUrl: app.portfolioUrl,
      appliedDate: new Date(app.createdAt).toLocaleDateString()
    }));
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    if (this.user?.role === 'RECRUTEUR') {
      this.loadApplications();
    } else if (this.user?.role === 'CANDIDATE') {
      this.loadMyApplications();
    }
  }

  loadApplicationsByJob(jobTitle: string) {
    this.isLoading = true;
    this.applicationService.getApplicationsByJobTitle(jobTitle).subscribe({
      next: (applications: Application[]) => {
        this.applications = applications;
        this.dataSource.data = applications.map((app) => ({
          candidate: app.candidate.name,
          job: app.job.title,
          status: app.status,
          id: app.id,
          email: app.candidate.email,
          appliedDate: new Date(app.createdAt).toLocaleDateString()
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.snackBar.open('Failed to load applications', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  loadApplicationsByJobTitle(title: string) {
    this.isLoading = true;

    this.applicationService.filterApplicationsByJobTitle(title).subscribe({
      next: (applications: Application[]) => {
        this.applications = applications;
        this.dataSource.data = applications.map((app) => ({
          candidate: app.candidate.name,
          // job: app.job.title || '',
          status: app.status,
          id: app.id,
          email: app.candidate.email,
          appliedDate: new Date(app.createdAt).toLocaleDateString()
        }));
        console.log('Filtered applications:', this.dataSource.data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading filtered applications:', error);
        this.snackBar.open('Erreur lors du filtrage par titre', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  updateApplicationStatus(
    id: number,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PRESELECTED'
  ) {
    this.isLoading = true;
    this.applicationService.updateStatus(id, status).subscribe({
      next: (updatedApplication) => {
        // Mise à jour locale pour éviter de recharger tout le tableau
        const index = this.dataSource.data.findIndex((app) => app.id === id);
        if (index !== -1) {
          this.dataSource.data[index].status = status;
          this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
        }
        this.snackBar.open('Status updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open(`Error: ${err.message}`, 'Close', {
          duration: 5000
        });
      },
      complete: () => {
        this.isLoading = false; // Désactiver le spinner
      }
    });
  }

  get userName(): string {
    return this.user?.name || this.user?.email?.split('@')[0] || 'Guest';
  }

  viewDetails(application: any) {
    console.log('Data sent to dialog:', application);

    if (this.user.role === 'CANDIDATE') {
      this.dialog.open(ApplicationDetailsComponent, {
        width: '850px',
        data: {
          candidate: {
            name: application.candidate.name,
            email: application.candidate.email,
            experience: application.candidate.experience,
            skills: application.candidate.skills
          },
          job: {
            title: application.job.title,
            skills: application.job.skills,
            experience: application.job.experience
          },
          status: application.status,
          cvUrl: application.cvUrl || null,
          coverLetterUrl: application.coverLetterUrl || null,
          portfolioUrl: application.portfolioUrl || null,
          createdAt: application.appliedDate,
          updatedAt: application.updatedAt || application.appliedDate
        },
        panelClass: 'custom-dialog-container'
      });
      return;
    } else if (this.user.role === 'RECRUTEUR') {
      this.dialog.open(ApplicationDetailsComponent, {
        width: '850px',
        data: {
          candidate: {
            name: application.candidate,
            email: application.email,
            experience: application.experience,
            skills: application.skills
          },
          job: {
            title: application.job,
            experience: application.experience,
            skills: application.skills
          },
          status: application.status,
          cvUrl: application.cvUrl || null,
          coverLetterUrl: application.coverLetterUrl || null,
          portfolioUrl: application.portfolioUrl || null,
          createdAt: application.appliedDate,
          updatedAt: application.updatedAt || application.appliedDate
        },
        panelClass: 'custom-dialog-container'
      });
      return;
    } else {
      this.snackBar.open('No details available', 'Close', {
        duration: 3000
      });
    }
  }
}
