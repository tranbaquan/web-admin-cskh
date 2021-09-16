import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthGuard} from './shared/provider/auth-guard';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./layout/layout.module').then(resolve => resolve.LayoutModule)
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
