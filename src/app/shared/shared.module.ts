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
import {PaginationComponent} from './component/pagination/pagination.component';
import {SelectDirective} from './component/select.directive';
import {CKEditorModule} from 'ckeditor4-angular';
import {TableDirective} from './component/table.directive';
import {ModalComponent} from './component/modal/modal.component';
import {ModalHeaderComponent} from './component/modal/modal-header/modal-header.component';
import {ModalBodyComponent} from './component/modal/modal-body/modal-body.component';
import {ModalFooterComponent} from './component/modal/modal-footer/modal-footer.component';
import {PricePipe} from './pipe/price.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CKEditorModule
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    IconButtonDirective,
    VndPipe,
    PricePipe,
    PaginationComponent,
    SelectDirective,
    TableDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
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
    PricePipe,
    PaginationComponent,
    SelectDirective,
    CKEditorModule,
    TableDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ]
})
export class SharedModule {
}

