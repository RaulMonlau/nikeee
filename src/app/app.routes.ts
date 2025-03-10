import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // cuando no se especifique nada, redirige a home
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'product', component: ProductsComponent },
  { path: '**', redirectTo: 'home' } // ruta comodín
];