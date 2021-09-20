import {NgModule} from '@angular/core';
import {InputDirective} from './component/input.directive';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ButtonDirective} from './component/button.directive';
import {UserService} from './service/user.service';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconButtonDirective} from './component/icon-button.directive';
import {VndPipe} from './pipe/vnd.pipe';
import { PaginationComponent } from './component/pagination/pagination.component';
import { SelectDirective } from './component/select.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    IconButtonDirective,
    VndPipe,
    PaginationComponent,
    SelectDirective
  ],
  providers: [
    UserService,
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    InputDirective,
    ButtonDirective,
    FontAwesomeModule,
    IconButtonDirective,
    VndPipe,
    PaginationComponent,
    SelectDirective
  ]
})
export class SharedModule {
}


