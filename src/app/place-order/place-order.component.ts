import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})

export class PlaceOrderComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.cartItems = JSON.parse(storedItems);
    }
  }

  increaseQuantity(item: any) {
    // Find the product in the product list which comes from backend to get the available stock
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find((p: any) => p.ProductId === item.ProductId);
  
    if (product && item.Quantity < product.Quantity) {
      item.Quantity++;
      this.updateCart();
    } else {
      this.toastr.error('Cannot increase quantity beyond available stock!', 'Error');
    }
  }
  

  decreaseQuantity(item: any) {
    if (item.Quantity > 1) {
      item.Quantity--;
      this.updateCart();
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter(i => i.ProductId !== item.ProductId);
    this.updateCart();
  }

  updateCart() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  placeOrder() {
    this.cartItems.forEach(item => {
      const orderRequest = {
        customerId: '9ca135b5-655c-4389-965a-faea64b05e5c',
        productId: item.ProductId,
        quantity: item.Quantity
      };
  
      this.orderService.addOrder(orderRequest).subscribe({
        next: (response) => {
          this.toastr.success('Order placed successfully for product:');
        },
        error: (error) => {
          console.error('Error placing order:', error);
          if (error.error?.errors) {
            const errorMessages = Object.values(error.error.errors).flat();
            alert(`Failed to place order: ${errorMessages.join(', ')}`);
          } else {
            alert('Failed to place order. Please try again.');
          }
        },
      });
    });
  
    //clear the cart items
    localStorage.removeItem('cartItems');
    this.cartItems = [];
  }
  
}
