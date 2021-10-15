import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ClienteModel } from 'src/app/models/cliente.model';
import Swal from 'sweetalert2';
import { ClienteService } from './../../services/cliente.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  clientes: Observable<any[]>;
  clienteModel: ClienteModel[] = []
  nombre: string;
  busquedaNombre: any;

  constructor(firestore: AngularFirestore, private _clienteService: ClienteService) {
    this.clientes = firestore.collection('clientes').valueChanges();
  }

  ngOnInit(): void {
    this.obtenerClientes()
  }

  obtenerClientes() {
    this._clienteService.obtenerClientes().subscribe(resp => {
      this.clienteModel = resp;
    }, error => {
      console.log(error);
    })
  }

  eliminarCliente(cliente: ClienteModel) {

    Swal.fire({
      title: 'Borrar cliente',
      text: `¿Desea borrar a ${cliente.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar'
    }).then(resp => {
      if (resp.value) {

        this._clienteService.eliminarCliente(cliente.id).then(resp => {
          Swal.fire({
            title: 'Cliente borrado',
            text: 'Se ha borrado con exito',
            icon: 'success'
          })
        }).catch(error => {
          console.log(error);
          Swal.fire({
            title: 'Fallo borrar cliente',
            text: `${error}`,
            icon: 'error'
          })
        })

      }
    })

  }

  consultaByNombre(nombre: string){
    console.log(nombre);
    // return
    this._clienteService.obtenerClienteByNombre(nombre).subscribe(resp => {
      console.log(resp);
      this.busquedaNombre = resp;
    }, error=> {
      this.busquedaNombre = '';
      console.log(error);
    })
  }

}
