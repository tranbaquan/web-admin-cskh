import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ProductComponent} from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ProductComponent,
    CategoryComponent,
    ProductDetailComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LayoutModule {
}
