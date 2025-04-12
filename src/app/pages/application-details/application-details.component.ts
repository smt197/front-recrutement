import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Application } from 'src/app/interfaces/application';
import { TranslateStatusPipe } from 'src/app/pipes/translate-status.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeDatePipe } from 'src/app/pipes/safe-date.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    TranslateStatusPipe,
    MatTooltipModule,
    SafeDatePipe
  ],
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApplicationDetailsComponent implements OnInit {
  user: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'check_circle';
      case 'PRESELECTED':
        return 'check_circle_outline';
      case 'REJECTED':
        return 'cancel';
      case 'PENDING':
        return 'hourglass_empty';
      default:
        return 'help_outline';
    }
  }

  hasDocuments(): boolean {
    return !!(
      this.data?.cvUrl ||
      this.data?.coverLetterUrl ||
      this.data?.portfolioUrl
    );
  }

  showPdfPreview(pdfUrl: string) {
    const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
      width: '80vw',
      height: '90vh',
      data: { url: pdfUrl }
    });
  }
}
