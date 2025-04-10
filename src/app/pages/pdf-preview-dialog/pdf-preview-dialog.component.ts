import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'vex-pdf-preview-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrl: './pdf-preview-dialog.component.scss'
})
export class PdfPreviewDialogComponent {
  sanitizedUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer
  ) {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }
}
