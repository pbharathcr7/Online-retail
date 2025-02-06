import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private toastr: ToastrService) {}
  displayedColumns: string[] = ['productName', 'actions'];
  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    const storedWishlist = localStorage.getItem('wishlistItems');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

  removeFromWishlist(product: Product) {
    this.wishlist = this.wishlist.filter(item => item.ProductId !== product.ProductId);
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
    this.toastr.info('Removed from wishlist', 'Wishlist');
  }

  addToCart(product: Product) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    const existingItem = cartItems.find((item: any) => item.ProductId === product.ProductId);
    if (existingItem) {
      this.toastr.success('Product already in the cart!');
    } else {
      cartItems.push({ ProductId: product.ProductId, ProductName: product.ProductName, Quantity: 1 });
      this.toastr.success('Product added to cart!', 'Success');
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

  }
}
