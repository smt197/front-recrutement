import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth-service';
import { ApplicationDetailsComponent } from '../application-details/application-details.component';
import { PaginatedApplicationResponseDto } from 'src/app/interfaces/PaginateResponse';
import { TranslateStatusPipe } from 'src/app/pipes/translate-status.pipe';

@Component({
  selector: 'vex-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterLink,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TranslateStatusPipe
  ],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.scss'
})
export class CandidateDashboardComponent implements OnInit {
  user: any = null;
  applications: any[] = [];
  displayedColumns: string[] = ['job', 'appliedDate', 'status', 'details'];
  dataSource = new MatTableDataSource<any>();
  isLoading = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  pendingCount = 0;
  preselectedCount = 0;
  acceptedCount = 0;

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      if (user) {
        this.loadMyApplications();
      }
    });
  }

  loadMyApplications(): void {
    this.isLoading = true;
    this.applicationService
      .getMyApplications(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: PaginatedApplicationResponseDto) => {
          this.applications = response.applications || [];
          this.dataSource.data = this.prepareData(this.applications);
          this.totalItems = response.total || this.applications.length;
          
          this.calculateStats(this.applications);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur de chargement des candidatures:', error);
          this.snackBar.open('Impossible de charger vos candidatures', 'Fermer', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }

  calculateStats(apps: any[]): void {
    this.pendingCount = apps.filter((a) => a.status === 'PENDING').length;
    this.preselectedCount = apps.filter((a) => a.status === 'PRESELECTED').length;
    this.acceptedCount = apps.filter((a) => a.status === 'ACCEPTED').length;
  }

  prepareData(applications: any[]): any[] {
    return applications.map((app) => ({
      ...app,
      jobTitle: app.job?.title || 'Poste inconnu',
      appliedDate: new Date(app.createdAt).toLocaleDateString()
    }));
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.loadMyApplications();
  }

  viewDetails(application: any): void {
    this.dialog.open(ApplicationDetailsComponent, {
      width: '850px',
      data: {
        candidate: {
          name: this.user?.name || application.candidate?.name,
          email: this.user?.email || application.candidate?.email,
          experience: this.user?.experience || application.candidate?.experience,
          skills: this.user?.skills || application.candidate?.skills
        },
        job: {
          title: application.job?.title || application.jobTitle,
          experience: application.job?.experience,
          skills: application.job?.skills
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
  }

  goToJobs(): void {
    this.router.navigate(['/job']);
  }
}
