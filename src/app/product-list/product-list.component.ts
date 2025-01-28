import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { OrderService } from '../order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
  
      // Save the product list in localStorage for later use
      localStorage.setItem('products', JSON.stringify(this.products));
    });
  }
  

  // add to cart functionality
  addToCart(product: any): void {
    console.log('Adding to cart:', product);
    
    const cartItem = {
      ProductId: product.ProductId,
      ProductName: product.ProductName,
      Quantity: 1
    };
  
    let cartItems = [];
    const existingCart = localStorage.getItem('cartItems');
    if (existingCart) {
      cartItems = JSON.parse(existingCart);
  
      // Check if the product already exists in the cart
      const existingItem = cartItems.find((item: any) => item.ProductId === product.ProductId);
      if (existingItem) {
        // Ensure quantity doesn't exceed available stock
        if (existingItem.Quantity < product.Quantity) {
          existingItem.Quantity += 1;
          this.toastr.success('Product quantity updated in cart!', 'Success');
        } else {
          this.toastr.error('Cannot add more than available quantity!', 'Error');
          return;
        }
      } else {
        cartItems.push(cartItem);
        this.toastr.success('Product added to cart successfully!', 'Success');
      }
    } else {
      cartItems = [cartItem];
      this.toastr.success('Product added to cart successfully!', 'Success');
    }
  
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
  
}
