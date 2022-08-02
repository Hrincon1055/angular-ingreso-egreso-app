import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public userName: string = '';
  public userAuthUnsubscribe!: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userAuthUnsubscribe = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user !== null))
      .subscribe(({ user }) => {
        this.userName = user?.nombre!;
      });
  }
  ngOnDestroy(): void {
    this.userAuthUnsubscribe.unsubscribe();
  }
  public logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
