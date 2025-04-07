import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VexColorScheme, VexConfigName } from '@vex/config/vex-config.interface';
import { VexConfigService } from '@vex/config/vex-config.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private configService: VexConfigService
  ) {
    this.configuretheme();
  }
  ngOnInit(): void {

  };


  configuretheme() {
    this.configService.updateConfig({
      id: VexConfigName.ares,
      name: 'Ares',
      bodyClass: 'vex-layout-ares',
      imgSrc: '/vex-landing.visurel.com/assets/img/layouts/ares.png',
      direction: "ltr",
      showSettingTheme: {
        visible: false
      },      
      style: {
        colorScheme: VexColorScheme.LIGHT,
        button: {
          borderRadius: undefined,
        },
      },
      layout: "horizontal",
      boxed: false,
      sidenav: {
        title: "CABI-RH",
        imageUrl: "assets/img/logo/logo.svg",
        showCollapsePin: true,
        user: {
          visible: false
        },
        search: {
          visible: false
        },
        state: 'expanded'
      },
      toolbar: {
        fixed: true,
        user: {
          visible: true,
        },
        search: {
          visible: false
        },
        panel: {
          visible: false
        },
      },
      footer: {
        visible: false,
        fixed: true
      }
    });
  }
}


