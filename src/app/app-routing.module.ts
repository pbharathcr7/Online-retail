import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { PlaceOrderComponent } from './place-order/place-order.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'place-order', component: PlaceOrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
