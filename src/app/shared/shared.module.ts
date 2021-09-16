import {NgModule} from '@angular/core';
import {InputDirective} from './component/input.directive';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ButtonDirective} from './component/button.directive';
import {UserService} from './service/user.service';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [
    InputDirective,
    ButtonDirective
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    InputDirective,
    ButtonDirective,
    FontAwesomeModule
  ]
})
export class SharedModule {
}


