import {Component, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-regular-svg-icons';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {UserResponseModel} from '../shared/model/response/user-response.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import firebase from 'firebase/compat/app';
import * as messaging from 'firebase/messaging';
import {BehaviorSubject} from 'rxjs';
import {FirebaseService} from './firebase.service';

const firebaseConfig = {
  apiKey: 'AIzaSyBYX9m-Cu_S79oqd1DyuUoO2MljOBKkgvM',
  authDomain: 'notication-tmdt.firebaseapp.com',
  projectId: 'notication-tmdt',
  storageBucket: 'notication-tmdt.appspot.com',
  messagingSenderId: '398924202747',
  appId: '1:398924202747:web:6eee93da3e0e7687e4265e',
  measurementId: 'G-PVPDLZTXRM'
};

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
  subject = new BehaviorSubject(null);

  constructor(private router: Router,
              private firebaseService: FirebaseService) {
    this.isMenuShow = false;

    this.subject.subscribe(data => {
      if (data != null) {
        console.log(data);
      }
    });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user:info');
    if (user) {
      this.user = Object.assign(new UserResponseModel(), JSON.parse(user));
    } else {
      this.router.navigate(['login']).then(() => {
      });
    }

    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const message = messaging.getMessaging(firebaseApp);

    messaging.getToken(message, {
      vapidKey: 'BPYPqxNbCmR_NNt0jxvZskuvUUpkt5OMPP0qYWQvSged5KvOeOyjyx9HkgSGcX9ndUyjOM9FbmXwuktsiQmjWhc',
    }).then((token) => {
      this.firebaseService.subscribeToTopic(token, this.user.UserID).subscribe(res => {
        console.log(res);
      });
    });

    messaging.onMessage(message, (payload) => {
      this.subject.next(payload);
    });
  }

  closeMenu(): void {
    this.isMenuShow = false;
  }
}
