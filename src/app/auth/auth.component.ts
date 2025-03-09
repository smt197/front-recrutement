import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vex-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [
    CommonModule, 
    RouterOutlet, 
    MatIconModule, 
    MatButtonModule,
    ],
})
export class AuthComponent implements OnInit {

  title$: Observable<string> = this.configService.select(
      (config) => config.sidenav.title
    );
  constructor( private router: Router,
        private readonly configService: VexConfigService,
  ){

  }
  ngOnInit(): void {
    
  }
register() {
  this.router.navigate(['/register']);
}
login() {
  this.router.navigate(['/']);
}

}
