import { NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, NgZone } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { fadeInUp400ms } from "@vex/animations/fade-in-up.animation";
import { ParamsEmailVerify } from "src/app/interfaces/Params-email-verify";
import { AuthService } from "src/app/services/auth-service";

@Component({
  selector: 'vex-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['../auth.component.scss'],
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    MatIconModule,
    NgIf,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class EmailVerifyComponent implements OnInit {

  params: ParamsEmailVerify | null = null;
  mailmessage: string | undefined = "";
  isLoading: boolean = true;

  constructor(
    private cd: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    // Utiliser NgZone pour garantir que les changements d'état sont détectés
    this.zone.run(() => {
      this.sendEmailVerifyService();
    });
  }

  back() {
    this.router.navigate(['/']);
  }

  sendEmailVerifyService() {
    this.params = this.getParameterUrl(this.activatedRoute);

    if (this.params) {

      this.authService.emailverify(this.params).subscribe({
        next: (response) => {
          this.mailmessage = response.message;
          this.markDetectChangeView();
        },
        error: (error: HttpErrorResponse) => {
          this.mailmessage = error.error.message;
          this.markDetectChangeView();
        }
      });
    }
  }

  markDetectChangeView() {
    this.cd.detectChanges();
    // Mettre à jour l'état dans NgZone pour garantir la détection des changements
    this.zone.run(() => {
      this.isLoading = false;
      // Force le rafraîchissement du composant
      this.cd.detectChanges();
    });
    setTimeout(() => {
      this.cd.detectChanges();
    }, 100);
  }

  getParameterUrl(activatedRoute: ActivatedRoute): ParamsEmailVerify {
    return {
      id: activatedRoute.snapshot.paramMap.get('id') || '',
      hash: activatedRoute.snapshot.paramMap.get('hash') || '',
      uuid: activatedRoute.snapshot.paramMap.get('uuid') || '',
      expires: activatedRoute.snapshot.queryParamMap.get('expires') || '',
      signature: activatedRoute.snapshot.queryParamMap.get('signature') || ''
    };
  }
}