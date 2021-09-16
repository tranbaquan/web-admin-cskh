import {Component, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import {faSearch, faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {UserResponseModel} from '../shared/model/response/user-response.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        // width: '300px'
      })),
      state('closed', style({
        display: 'none',
        // width: '0px',
      })),
      transition('open => closed', [
        animate('0.1s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.1s ease')
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit {
  faUser = faUser;
  faSearch = faSearch;
  faBars = faBars;
  faTimes = faTimes;

  user: UserResponseModel;
  isMenuShow: boolean;

  constructor(private router: Router) {
    this.isMenuShow = true;
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
}
