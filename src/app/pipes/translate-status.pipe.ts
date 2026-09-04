// translate-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
  standalone: true
})
export class TranslateStatusPipe implements PipeTransform {
  transform(value: string): string {
    const translations: Record<string, string> = {
      PENDING: 'En attente',
      PRESELECTED: 'Présélectionné',
      ACCEPTED: 'Accepté',
      REJECTED: 'Rejeté',
      INTERVIEW_SCHEDULED: 'Entretien planifié'
    };
    return translations[value] || value;
  }
}
