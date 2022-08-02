import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as actionsUi from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  public ingresoForm!: FormGroup;
  public tipo: string = 'ingreso';
  public cargando: boolean = false;
  public cargandoUnsubcribe!: Subscription;
  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.cargandoUnsubcribe = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));
    this.ingresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    this.cargandoUnsubcribe.unsubscribe();
  }
  public save(): void {
    this.store.dispatch(actionsUi.isLoading());
    if (this.ingresoForm.invalid) return;
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(actionsUi.stopLoading());
        Swal.fire('Registro Creado', descripcion, 'success');
      })
      .catch((err) => {
        this.store.dispatch(actionsUi.stopLoading());
        Swal.fire('Error', err.message, 'error');
      });
  }
}
