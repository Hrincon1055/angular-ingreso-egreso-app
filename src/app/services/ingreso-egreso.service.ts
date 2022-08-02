import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  public crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authService.user.uid;
    delete ingresoEgreso.uid;
    const newIngresoEgreso = {
      descripcion: ingresoEgreso.descripcion,
      monto: ingresoEgreso.monto,
      tipo: ingresoEgreso.tipo,
    };
    return this.firestore
      .doc(`${uid}/ingreso-egreso`)
      .collection('items')
      .add(newIngresoEgreso);
  }
  public initIngresosEgresosListener(uid: string) {
    return this.firestore
      .collection(`${uid}/ingreso-egreso/items`)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      );
  }
  public borrarIngresoEgreso(uidItem: string) {
    const uid = this.authService.user.uid;
    return this.firestore
      .doc(`${uid}/ingreso-egreso/items/${uidItem}`)
      .delete();
  }
}
