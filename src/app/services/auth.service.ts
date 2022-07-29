import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  public initAuthListener() {
    this.auth.authState.subscribe((fbUser) => {
      console.log('auth.service LINE 10 =>', fbUser?.uid);
    });
  }

  public crearUsuario(nombre: string, correo: string, password: string) {
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
  public logout() {
    return this.auth.signOut();
  }
  public isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
