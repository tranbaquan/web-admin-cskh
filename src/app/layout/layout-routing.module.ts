import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {NgModule} from '@angular/core';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {OrderComponent} from "./order/order.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/category',
      },
      {
        path: 'category',
        pathMatch: 'full',
        component: CategoryComponent
      },
      {
        path: 'product',
        pathMatch: 'full',
        component: ProductComponent
      },
      {
        path: 'product/:productId',
        pathMatch: 'full',
        component: ProductDetailComponent
      },
      {
        path: 'order',
        pathMatch: 'full',
        component: OrderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
}
