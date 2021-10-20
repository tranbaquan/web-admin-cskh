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
import {ToastrModule} from 'ngx-toastr';
import {PricePipe} from './pipe/price.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCurrencyFormatModule} from 'mat-currency-format';
import {GallerySliderComponent} from './component/gallery-slider/gallery-slider.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {EscapeHtmlPipe} from './pipe/escape-html.pipe';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CKEditorModule,
    ToastrModule.forRoot(),
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatCurrencyFormatModule,
    MatFormFieldModule
  ],
  declarations: [
    InputDirective,
    ButtonDirective,
    IconButtonDirective,
    VndPipe,
    PricePipe,
    EscapeHtmlPipe,
    PaginationComponent,
    SelectDirective,
    TableDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    GallerySliderComponent
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
    EscapeHtmlPipe,
    PaginationComponent,
    SelectDirective,
    CKEditorModule,
    TableDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ToastrModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatCurrencyFormatModule,
    GallerySliderComponent,
    MatFormFieldModule
  ]
})
export class SharedModule {
}

