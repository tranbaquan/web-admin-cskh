import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {SharedModule} from '../shared/shared.module';
import {HomeComponent} from './home/home.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent
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
