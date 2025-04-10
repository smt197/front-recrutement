// translate-status.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
  standalone: true
})
export class TranslateStatusPipe implements PipeTransform {
  transform(value: 'PENDING' | 'ACCEPTED' | 'REJECTED'): string {
    const translations = {
      PENDING: 'En attente',
      ACCEPTED: 'Accepté',
      REJECTED: 'Rejeté'
    };
    return translations[value] || value;
  }
}
