import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '@vex/utils/track-by';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { Router, RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgClass,
    NgIf,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ]
})
export class ToolbarUserDropdownComponent implements OnInit {


  user: any = null;

  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:account_circle',
      label: 'My Profile',
      description: 'Personal Information',
      colorClass: 'text-teal-600',
      route: '/apps/social'
    },
    {
      id: '2',
      icon: 'mat:move_to_inbox',
      label: 'My Inbox',
      description: 'Messages & Latest News',
      colorClass: 'text-primary-600',
      route: '/apps/chat'
    },
    {
      id: '3',
      icon: 'mat:list_alt',
      label: 'My Projects',
      description: 'Tasks & Active Projects',
      colorClass: 'text-amber-600',
      route: '/apps/scrumboard'
    },
    {
      id: '4',
      icon: 'mat:table_chart',
      label: 'Billing Information',
      description: 'Pricing & Current Plan',
      colorClass: 'text-purple-600',
      route: '/pages/pricing'
    }
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600'
    },
    {
      id: 'away',
      label: 'Away',
      icon: 'mat:access_time',
      colorClass: 'text-orange-600'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red-600'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray-600'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;

  constructor(
    private cd: ChangeDetectorRef,
    private popoverRef: VexPopoverRef<ToolbarUserDropdownComponent>,
    private authService: AuthService,
        private snackbar: MatSnackBar,
        private router: Router,
    
  ) {}

  ngOnInit(): void {
    // Version simple (sans Observable)
    // this.user = this.authService.userValue;
    
    // Version avec Observable (si vous voulez des mises à jour en temps réel)
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  setStatus(status: OnlineStatus) {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close() {
    this.popoverRef.close();
    
    this.authService.logout().subscribe({
      next: (response) => {
        // Supprimez le token côté client aussi
        localStorage.removeItem('jwt_token'); // Ou votre méthode de stockage
        this.authService.clearToken();
        this.authService.clearUser();
        this.authService.user = null;
        this.showMessage(response.message);
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Logout error:', error);
        this.showMessage(error.error.message || 'Erreur lors de la déconnexion');
        
        // Redirection quand même si le token est invalide
        console.log('Logout success:', error);
        localStorage.removeItem('jwt_token');

        this.router.navigate(['/login']);
      }
    });
  }

  toggle2FA(event: MatSlideToggleChange) {
    const enable = event.checked;
  
    this.authService.toggle2FA(enable).subscribe({
      next: (res: any) => {
        this.user.isTwoFA = true;
        this.cd.markForCheck();
        this.showMessage(`2FA ${enable ? 'true' : 'false'} avec succès`);
      },
      error: (err) => {
        this.showMessage(err.error.message || 'Une erreur est survenue');
        // Revert switch si erreur
        this.user.isTwoFA = false;
        this.cd.markForCheck();
      }
    });
  }
  
  get userName(): string {
    return this.user?.role;
  }


  showMessage(params: string | undefined) {
    if (params) {
      this.snackbar.open(params, "Fermer", { duration: 10000 });
    }
  }
}
