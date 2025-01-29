import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface OrderRequest {
  customerId: string;
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://uiexercise.theproindia.com/api/Order/AddOrder';

  constructor(private http: HttpClient) { }

  addOrder(orderRequest: OrderRequest): Observable<any> {
    console.log('Sending order request:', orderRequest);
    return this.http.post(this.apiUrl, orderRequest).pipe(
      tap(response => {
        console.log('Received response:', response);
      })
    );
  }
}