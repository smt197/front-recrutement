// safe-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safeDate', standalone: true })
export class SafeDatePipe implements PipeTransform {
  transform(value: any, format: string = 'mediumDate'): string {
    return value ? new Date(value).toLocaleDateString() : 'Non renseignée';
  }
}
