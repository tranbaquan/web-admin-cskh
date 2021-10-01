import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ProductComponent} from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { OrderStatusComponent } from './order/order-status/order-status.component';
import {FormsModule} from '@angular/forms';
import { ProductTypeComponent } from './product-type/product-type.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ProductComponent,
    CategoryComponent,
    ProductDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    OrderStatusComponent,
    ProductTypeComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule,
    FormsModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LayoutModule {
}
