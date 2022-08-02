import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso';
import { Subscription } from 'rxjs';
import { AppStateWithIngresoEgreso } from '../ingreso-egreso.reducer';
@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  public ingresos: number = 0;
  public egresos: number = 0;
  public totalEgresos: number = 0;
  public totalIngresos: number = 0;
  public ingresosEgresosUnSubscribe!: Subscription;
  // Doughnut
  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };
  constructor(private store: Store<AppStateWithIngresoEgreso>) {}

  ngOnInit(): void {
    this.ingresosEgresosUnSubscribe = this.store
      .select('ingresosEgresos')
      .subscribe(({ items }) => {
        this.generarEstadistica(items);
      });
  }
  ngOnDestroy(): void {
    this.ingresosEgresosUnSubscribe.unsubscribe();
  }
  public generarEstadistica(items: IngresoEgreso[]) {
    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [{ data: [this.totalIngresos, this.totalEgresos] }],
    };
  }

  // events
  // public chartClicked({
  //   event,
  //   active,
  // }: {
  //   event: ChartEvent;
  //   active: {}[];
  // }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event: ChartEvent;
  //   active: {}[];
  // }): void {
  //   console.log(event, active);
  // }
}
