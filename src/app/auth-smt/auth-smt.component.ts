import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'vex-auth-smt',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatIconModule, MatButtonModule],
  templateUrl: './auth-smt.component.html',
  styleUrl: './auth-smt.component.scss'
})
export class AuthSmtComponent {
  title$: Observable<string> = this.configService.select(
    (config) => config.sidenav.title
  );
  constructor(
    private router: Router,
    private readonly configService: VexConfigService
  ) {}
  ngOnInit(): void {}
  // register() {
  //   this.router.navigate(['/register']);
  // }
  register() {
       this.router.navigate(['/']);
  }
  login() {
    this.router.navigate(['/']);
  }
}
