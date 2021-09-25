import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {NgModule} from '@angular/core';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {ProductDetailResolver} from './product/product-detail/product-detail.resolver';
import {ProducersResolver} from './product/product-detail/producers.resolver';
import {OrderComponent} from './order/order.component';
import {ProductTypeResolver} from './product/product-detail/product-type.resolver';
import {OrderDetail} from "../shared/model/order-detail.model";
import {OrderDetailComponent} from "./order/order-detail/order-detail.component";

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
        component: ProductDetailComponent,
        resolve: {
          product: ProductDetailResolver,
          producers: ProducersResolver,
          productTypes: ProductTypeResolver
        },
      },
      {
        path: 'order',
        pathMatch: 'full',
        component: OrderComponent
      },
      {
        path: 'order-detail',
        pathMatch: 'full',
        component: OrderDetailComponent
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
