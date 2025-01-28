import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']

})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value)
        .subscribe({
          next: (response) => {
            alert('Product added successfully');
            this.productForm.reset();
          },
          error: (error) => {
            alert('Error adding product')
          }
        });
    }
  }
}
