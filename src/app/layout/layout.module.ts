import {NgModule} from '@angular/core';
import {LayoutComponent} from './layout.component';
import {LayoutRoutingModule} from './layout-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule
  ]
})
export class LayoutModule {
}
