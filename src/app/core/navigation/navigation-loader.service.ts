import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(
    private readonly layoutService: VexLayoutService,
    private readonly authService: AuthService
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.loadNavigation(user);
    });
  }

  loadNavigation(user?: any): void {
    const userRole = user?.role || 'CANDIDATE';

    if (userRole === 'CANDIDATE') {
      this._items.next([
        {
          type: 'subheading',
          label: 'Espace Candidat',
          children: [
            {
              type: 'link',
              label: 'Mes Candidatures',
              route: '/candidate-dashboard',
              icon: 'mat:assignment',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Offres d\'emploi',
              route: '/job',
              icon: 'mat:work'
            }
          ]
        }
      ]);
    } else {
      this._items.next([
        {
          type: 'subheading',
          label: 'Gestion RH',
          children: [
            {
              type: 'link',
              label: 'Dashboard Candidatures',
              route: '/home',
              icon: 'mat:dashboard',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Gestion des Offres',
              route: '/job',
              icon: 'mat:work'
            }
          ]
        }
      ]);
    }
  }
}
