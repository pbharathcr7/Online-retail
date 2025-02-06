import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../product.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  wishlist: Product[] = [];  
  p: number = 1;
  itemsPerPage: number = 24;
  totalProduct: any;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalProduct = data.length;
        this.filteredProducts = data;
        localStorage.setItem('products', JSON.stringify(this.products));

        const storedWishlist = localStorage.getItem('wishlistItems');
        if (storedWishlist) {
          this.wishlist = JSON.parse(storedWishlist);
        }
      },
      error: (err) => {
        console.log("Error", err);
      },
      complete: () => {
        console.log("Fetched product data");
      }
    });

    this.searchService.currentSearchTerm.subscribe({
      next: (term) => {
        this.filterProducts(term);
      },
      error: (err) => {
        console.log("Error", err);
      }
    });
  }

  filterProducts(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item.ProductId === product.ProductId);
  }

  toggleWishlist(product: Product) {
    const index = this.wishlist.findIndex(item => item.ProductId === product.ProductId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.toastr.info('Removed from wishlist', 'Wishlist');
    } else {
      this.wishlist.push(product);
      this.toastr.success('Added to wishlist', 'Wishlist');
    }
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlist));
  }

  addToCart(product: Product): void {
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

      const existingItem = cartItems.find((item: any) => item.ProductId === product.ProductId);
      if (existingItem) {
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
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}
