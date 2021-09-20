import {Component, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {UserResponseModel} from '../shared/model/response/user-response.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('slideToggle', [
      transition(':enter', [
        style({width: '0'}),
        animate('300ms ease-in-out', style({width: '300px'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({width: '0'}))
      ]),
      state('*', style({width: '300px'}))
    ])
  ]
})
export class LayoutComponent implements OnInit {
  faUser = faUser;
  faBars = faBars;
  faTimes = faTimes;

  user: UserResponseModel;
  isMenuShow: boolean;

  constructor(private router: Router) {
    this.isMenuShow = false;
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user:info');
    if (user) {
      this.user = Object.assign(new UserResponseModel(), JSON.parse(user));
    } else {
      this.router.navigate(['login']).then(() => {
      });
    }
  }

  redirectTo(path: string): void {
    this.router.navigate([path]).then(() => {
    });
  }
}
