import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LayoutComponent } from '../layout.component';
import { AplazoButtonComponent } from '@apz/shared-ui/button';
import { AplazoDashboardComponents } from '@apz/shared-ui/dashboard';
import { AplazoSidenavLinkComponent } from '../../../../../projects/shared-ui/sidenav/src';
import { ROUTE_CONFIG } from '../../../core/infra/config/routes.config';
import { Subject } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let router: jasmine.SpyObj<Router>;
  let titleService: jasmine.SpyObj<Title>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<any>();
    const routerSpy = jasmine.createSpyObj(
      'Router',
      ['navigate', 'createUrlTree', 'serializeUrl'],
      {
        events: routerEventsSubject.asObservable(),
      }
    );
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']); // Corrected: Ensure setTitle is a spy
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: () => 'test-param',
        },
      },
    });

    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterOutlet,
        RouterLink,
        AplazoButtonComponent,
        AplazoDashboardComponents,
        AplazoSidenavLinkComponent,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Title, useClass: Title }, // Corrected: Ensure Title service is provided correctly
      ],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    activatedRoute = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when logo is clicked', () => {
    component.clickLogo();
    expect(router.navigate).toHaveBeenCalledWith([
      ROUTE_CONFIG.app,
      ROUTE_CONFIG.home,
    ]);
  });

  it('should remove token and navigate to login on logout', () => {
    spyOn(localStorage, 'removeItem');
    component.logOut();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith([ROUTE_CONFIG.login]);
  });
});
