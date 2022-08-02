import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userUnsubscribe!: Subscription;
  public ingresosEgresosUnsubscribe!: Subscription;
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userUnsubscribe = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user !== null))
      .subscribe(({ user }) => {
        this.ingresosEgresosUnsubscribe = this.ingresoEgresoService
          .initIngresosEgresosListener(user?.uid!)
          .subscribe((ingresosEgresos) => {
            this.store.dispatch(
              ingresoEgresoActions.setItems({ items: ingresosEgresos })
            );
          });
      });
  }
  ngOnDestroy(): void {
    this.userUnsubscribe?.unsubscribe();
    this.ingresosEgresosUnsubscribe?.unsubscribe();
  }
}
