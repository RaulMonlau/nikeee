import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [ProductListComponent]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  ngOnInit(): void {
    // Productos iniciales (existentes)
    this.products = [
      { reference: 'ABC123', name: 'Producto1', price: 100, description: 'Descripción del producto 1', productType: 'tipo1', offer: true, productImageData: '' },
      { reference: 'DEF456', name: 'Producto2', price: 200, description: 'Descripción del producto 2', productType: 'tipo2', offer: false, productImageData: '' }
    ];
  }

  
}