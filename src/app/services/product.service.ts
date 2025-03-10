import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<any[]>([
    { reference: 'ABC123', name: 'Producto1', price: 100, description: 'Descripción del producto 1', productType: 'tipo1', offer: true, productImageData: '' },
    { reference: 'DEF456', name: 'Producto2', price: 200, description: 'Descripción del producto 2', productType: 'tipo2', offer: false, productImageData: '' }
  ]);
  products$ = this.productsSubject.asObservable();

  get products(): any[] {
    return this.productsSubject.getValue();
  }

  addOrUpdateProduct(product: any): void {
    const products = [...this.products];
    const index = products.findIndex(p => p.reference === product.reference);
    if (index !== -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.productsSubject.next(products);
  }
}