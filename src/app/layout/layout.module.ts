import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ProductComponent} from './product/product.component';
import {CategoryComponent} from './category/category.component';
import {ProductDetailComponent} from './product/product-detail/product-detail.component';
import {OrderComponent} from './order/order.component';
import {OrderDetailComponent} from './order/order-detail/order-detail.component';
import {OrderStatusComponent} from './order/order-status/order-status.component';
import {FormsModule} from '@angular/forms';
import {ProductTypeComponent} from './product-type/product-type.component';
import {TreeviewModule} from 'ngx-treeview';
import {UserComponent} from './user/user.component';
import {CustomerComponent} from './customer/customer.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ProductComponent,
    CategoryComponent,
    ProductDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    OrderStatusComponent,
    ProductTypeComponent,
    UserComponent,
    CustomerComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule,
    FormsModule,
    TreeviewModule.forRoot(),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LayoutModule {
}
