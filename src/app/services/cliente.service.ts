import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ClienteModel } from '../models/cliente.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private firestore: AngularFirestore) { }

  agregarCliente(cliente: ClienteModel): Promise<any> {
    return this.firestore.collection('cliente').add(cliente);
  }

  obtenerCliente(id: string): Observable<any>{
    // return this.firestore.collection('cliente').doc(id).snapshotChanges()
    return this.firestore.collection('cliente').doc(id).snapshotChanges()
    .pipe(
      map(this.crearArregloCliente)
    );
  }

  private crearArregloCliente(ClienteObj: any){    
    const Cliente: ClienteModel[] = [];
    if (ClienteObj === null) {
      return [];
    }
      Cliente.push({
        id: ClienteObj.payload.id,
        ...ClienteObj.payload.data()
      })

    return Cliente;
  }

  obtenerClientes(): Observable<any> {
    return this.firestore.collection('cliente').snapshotChanges()
      .pipe(
        map(this.crearArreglo)
      );
  }

  private crearArreglo(ClienteObj: Array<any>) {
    const Cliente: ClienteModel[] = [];
    if (ClienteObj === null) {
      return [];
    }

    ClienteObj.forEach(element => {
      Cliente.push({
        id: element.payload.doc.id,
        ...element.payload.doc.data()
      })
    });

    return Cliente;
  }

  actualizarCliente(cliente: ClienteModel): Promise<any>{
    const id = cliente.id
    delete cliente.id;
    console.log(cliente);
    console.log(id);
    
    return this.firestore.collection('cliente').doc(id).update(cliente)
  }

  eliminarCliente(id: string): Promise<any> {
    return this.firestore.collection('cliente').doc(id).delete();
  }


}
