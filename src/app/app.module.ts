import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SplashComponent} from './splash/splash.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {SharedModule} from './shared/shared.module';
import {LayoutModule} from './layout/layout.module';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    LoginPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
