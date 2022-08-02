import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actionsAuth from '../auth/auth.actions';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import * as actionsIngreosEngreso from '../ingreso-egreso/ingreso-egreso.actions';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userUnSubscriptio!: Subscription;
  private _user!: Usuario | null;
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}
  get user(): {
    uid?: string | undefined;
    nombre?: string | undefined;
    email?: string | undefined;
  } {
    return { ...this._user };
  }
  public initAuthListener(): void {
    this.auth.authState.subscribe((fbUser) => {
      if (fbUser) {
        this.userUnSubscriptio = this.firestore
          .doc(`${fbUser?.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this.store.dispatch(actionsAuth.setUser({ user: user }));
          });
      } else {
        this._user = null;
        if (this.userUnSubscriptio) {
          this.userUnSubscriptio.unsubscribe();
        }
        this.store.dispatch(actionsAuth.unSetUser());
        this.store.dispatch(actionsIngreosEngreso.unSetItems());
      }
    });
  }

  public crearUsuario(
    nombre: string,
    correo: string,
    password: string
  ): Promise<void> {
    return this.auth
      .createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const newUser = new Usuario(user?.uid!, nombre, correo);
        return this.firestore.doc(`${user?.uid}/usuario`).set({ ...newUser });
      });
  }
  public loginUsuario(correo: string, password: string) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }
  public logout(): Promise<void> {
    return this.auth.signOut();
  }
  public isAuth(): Observable<boolean> {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
