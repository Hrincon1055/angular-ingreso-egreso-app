import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import * as actionsUi from '../../shared/ui.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public cargando: boolean = false;
  public cargandoUnSubscription!: Subscription;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.cargandoUnSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }
  ngOnDestroy(): void {
    this.cargandoUnSubscription.unsubscribe();
  }
  public loginUsuario(): void {
    if (this.loginForm.invalid) return;
    this.store.dispatch(actionsUi.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor!',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const { correo, password } = this.loginForm.value;
    this.authService
      .loginUsuario(correo, password)
      .then((credenciales) => {
        // Swal.close();
        this.store.dispatch(actionsUi.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(actionsUi.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
