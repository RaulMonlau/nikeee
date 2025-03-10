import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<any[]>([]);
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