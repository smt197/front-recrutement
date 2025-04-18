import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { ToolbarUserDropdownComponent } from './toolbar-user-dropdown/toolbar-user-dropdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { User } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'vex-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatRippleModule, MatIconModule]
})
export class ToolbarUserComponent implements OnInit {
  dropdownOpen: boolean = false;
  user: any = null;

  constructor(
    private popover: VexPopoverService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Version simple (sans Observable)
    // this.user = this.authService.userValue;
    
    // Version avec Observable (si vous voulez des mises à jour en temps réel)
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  getUserInfo(){
    this.user = this.authService.user;                
  }
    

  showPopover(originRef: HTMLElement) {
    this.dropdownOpen = true;
    this.cd.markForCheck();

    const popoverRef = this.popover.open({
      content: ToolbarUserDropdownComponent,
      origin: originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
  

  get userName(): string {
    return this.user?.email?.split('@')[0] || 'Guest';
  }
}

