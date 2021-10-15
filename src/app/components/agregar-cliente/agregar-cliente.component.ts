import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteModel } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent implements OnInit {

  id: string;
  agregarForm: FormGroup;
  booleanAgregar: boolean;
  clienteModel: ClienteModel;
  cargando: boolean = true;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private _clienteService: ClienteService, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {

    if (this.id != 'agregar') {
      console.log("sera modificar");
      this.booleanAgregar = false;
      this.peticionEditar(this.id)
    } else {
      console.log("Es agregar");
      this.cargando = false;
      this.inicializarAgregar()
    }
  }

  getErrores(campo: string) {
    return this.agregarForm.controls[campo].errors && this.agregarForm.controls[campo].touched;
  }

  inicializarAgregar() {
    this.agregarForm = this.fb.group({
      nombre: [, [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(80)]],
      descripcion: [, [Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(250)]],
      correo: [, [Validators.required, Validators.maxLength(250), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono: [, [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(10)]],
      estado: ['Soltero', Validators.required],
    })
  }

  peticionEditar(id: string) {
    this._clienteService.obtenerCliente(id).subscribe(resp => {
      console.log(resp);
      this.clienteModel = resp;
      this.cargando = false;
      this.inicializarEditar(this.clienteModel)
    }, error => {
      console.log(error);
    });
  }

  inicializarEditar(cliente: ClienteModel) {
    this.agregarForm = this.fb.group({
      nombre: [cliente[0].nombre, [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(80)]],
      descripcion: [cliente[0].descripcion, [Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(250)]],
      correo: [cliente[0].correo, [Validators.required, Validators.maxLength(250), Validators.pattern(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono: [cliente[0].telefono, [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(10)]],
      estado: [cliente[0].estado, Validators.required],
    })
  }

  guardar() {
    this.agregarForm.value['telefono'] = parseInt(this.agregarForm.value['telefono'])
    console.log(typeof this.agregarForm.value['telefono']);

    console.log(this.agregarForm);

    if (this.agregarForm.invalid) { this.agregarForm.markAllAsTouched(); return }
    let texto = 'agregar';
    if (!this.booleanAgregar) {
      texto = 'editar'
    }

    Swal.fire({
      title: 'Guardar datos',
      text: `¿Esta seguro de ${texto} a ${this.agregarForm.value['nombre']}?`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showConfirmButton: true,
      showCancelButton: true
    }).then(resp => {
      console.log(resp);
      if (resp.value) {

        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Guardando información del cliente'
        });
        Swal.showLoading();

        this.clienteModel = this.agregarForm.value;
        console.log(this.clienteModel);

        if (this.booleanAgregar) {

          this._clienteService.agregarCliente(this.clienteModel).then(resp => {
            console.log(resp);
            Swal.fire({
              title: 'Cliente agregado',
              text: `Se ha agregado correctamente a ${this.clienteModel.nombre}`,
              icon: 'success'
            })
            this.agregarForm.reset({
              estado: 'Soltero'
            })

          }).catch(error => {
            Swal.fire({
              title: 'Error en el registro',
              text: `${error}`,
              icon: 'error'
            })
          })

        } else {

          this.clienteModel.id = this.id
          console.log(this.clienteModel.nombre);
          
          this._clienteService.actualizarCliente(this.clienteModel).then(resp => {
            console.log(resp);
            Swal.fire({
              title: 'Cliente actualizado',
              text: `Se actualizaron correctamente los datos`,
              icon: 'success'
            })
            // this.agregarForm.reset({
            //   estado: 'Soltero'
            // })
            this.router.navigateByUrl('/clientes')

          }).catch(error => {
            Swal.fire({
              title: 'Error al actualizar',
              text: `${error}`,
              icon: 'error'
            })
          })
        }


      }

    })

  }

}
