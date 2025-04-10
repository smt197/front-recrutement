import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Application } from 'src/app/interfaces/application';
import { TranslateStatusPipe } from 'src/app/pipes/translate-status.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeDatePipe } from 'src/app/pipes/safe-date.pipe';

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
  styleUrls: ['./application-details.component.scss']
})
export class ApplicationDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACCEPTED':
        return 'check_circle';
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
}
