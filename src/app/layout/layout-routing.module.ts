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
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import {OrderDetailResolver} from './order/order-detail/order-detail.resolver';
import {ProductTypeComponent} from './product-type/product-type.component';
import {UserComponent} from './user/user.component';
import {CustomerComponent} from './customer/customer.component';
import {CompanyResolver, StoreResolver} from './customer/customer.resolver';

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
        path: 'product/create',
        pathMatch: 'full',
        component: ProductDetailComponent,
        resolve: {
          producers: ProducersResolver,
          productTypes: ProductTypeResolver
        },
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
        path: 'order/:orderId',
        pathMatch: 'full',
        component: OrderDetailComponent,
        resolve: {
          order: OrderDetailResolver
        }
      },
      {
        path: 'type-product',
        pathMatch: 'full',
        component: ProductTypeComponent
      },
      {
        path: 'user',
        pathMatch: 'full',
        component: UserComponent
      },
      {
        path: 'customer',
        pathMatch: 'full',
        component: CustomerComponent,
        resolve: {
          stores: StoreResolver,
          companies: CompanyResolver
        }
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
