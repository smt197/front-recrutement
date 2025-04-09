import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { Application } from 'src/app/interfaces/application';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth-service';
import { FormsModule } from '@angular/forms'; // Ajoutez ceci
import { MatSelectModule } from '@angular/material/select';



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
  ],
})
export class DashboardComponent implements OnInit {
  user: any = null;
  applications: any[] = [];
  displayedColumns: string[] = ['candidate', 'job', 'status', 'actions'];
  dataSource: any[] = [];
  isLoading = false;
  selectedJobTitle: string = '';
  jobTitles: string[] = [];


  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (user?.role === 'RECRUTEUR') {
        this.loadApplications();
        this.loadJobTitles();
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
      this.loadApplicationsByJob(this.selectedJobTitle);
    }
  }

  loadApplications() {
    this.applicationService.getApplications().subscribe({
      next: (response: any) => {
        this.applications = response;
        this.dataSource = this.applications.map(app => ({
          candidate: app.candidate.name,
          job: app.job.title,
          status: app.status,
          id: app.id
        }));
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

  loadApplicationsByJob(jobTitle: string) {
    this.isLoading = true;
    
    this.applicationService.getApplicationsByJobTitle(jobTitle).subscribe({
      next: (applications: Application[]) => {
        this.applications = applications;
        this.dataSource = applications.map(app => ({
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
        this.snackBar.open('Failed to load applications', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  

  updateApplicationStatus(id: number, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') {
    this.applicationService.updateStatus(id, status).subscribe({
      next: (updatedApplication) => {
        // Mise à jour locale pour éviter de recharger tout le tableau
        const index = this.dataSource.findIndex(app => app.id === id);
        if (index !== -1) {
          this.dataSource[index].status = status;
          this.dataSource = [...this.dataSource]; // Trigger change detection
        }
        this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(`Error: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  get userName(): string {
    return this.user?.name || this.user?.email?.split('@')[0] || 'Guest';
  }
}