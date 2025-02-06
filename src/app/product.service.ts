import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  ProductId: string; 
  ProductName: string;
  Quantity: number;
  IsActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://uiexercise.theproindia.com/api/';
  constructor(private http: HttpClient) {}

  // Get all products with quantity >= 1
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}Product/GetAllProduct`).pipe(
      map((products) => {
        console.log('API Response:', products);
        return products.filter((product) => product.Quantity >= 1);
      })
    );
  }
  
  // Add a new product
  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Product/AddProduct`, product);
  }
}
