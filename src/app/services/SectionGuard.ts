import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({ providedIn: 'root' })
export class SectionGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const section: string | undefined = route.data['section'];
    if (!section) return true;

    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const permitted = new Set(this.auth.getPermittedSections(true));
    if (permitted.has(section)) return true;

    return this.router.createUrlTree(['/unauthorized'], { queryParams: { from: state.url } });
  }
}