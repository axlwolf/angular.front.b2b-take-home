import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AplazoButtonComponent } from '@apz/shared-ui/button';
import { AplazoDashboardComponents } from '@apz/shared-ui/dashboard';
import { AplazoSidenavLinkComponent } from '../../../../projects/shared-ui/sidenav/src';
import { ROUTE_CONFIG } from '../../core/infra/config/routes.config';
import { filter, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    AplazoDashboardComponents,
    AplazoButtonComponent,
    AplazoSidenavLinkComponent,
    RouterOutlet,
    RouterLink,
  ],
})
export class LayoutComponent implements OnInit {
  readonly #router = inject(Router);
  readonly appRoutes = ROUTE_CONFIG;
  readonly titleService = inject(Title);

  pageTitle: string = 'Home';

  ngOnInit(): void {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap((event) => {
          console.log({ event });
        })
      )
      .subscribe(() => {
        this.setPageTitle();
      });
  }

  setPageTitle(): void {
    const currentRoute = this.#router.url.split('/').pop();
    const titleMap: { [key: string]: string } = {
      home: 'Home',
      historial: 'Historial',
    };
    const title = titleMap[currentRoute!] || 'Home';
    this.titleService.setTitle(title);
    this.pageTitle = title;
  }

  clickLogo(): void {
    this.#router.navigate([ROUTE_CONFIG.app, ROUTE_CONFIG.home]);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.#router.navigate([ROUTE_CONFIG.login]);
  }
}
