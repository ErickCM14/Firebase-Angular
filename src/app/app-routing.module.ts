import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgregarClienteComponent } from './components/agregar-cliente/agregar-cliente.component';
import { ListaClientesComponent } from './components/lista-clientes/lista-clientes.component';

const routes: Routes = [
  {path: 'clientes' , component: ListaClientesComponent},
  {path: 'clientes/:id' , component: AgregarClienteComponent},
  {path: '**' , redirectTo: 'clientes'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
