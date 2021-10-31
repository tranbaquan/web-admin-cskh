import {Component, OnInit} from '@angular/core';
import {faUser, faBell, faCircle, faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {faBars, faTimes, faBullhorn} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {UserResponseModel} from '../shared/model/response/user-response.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import firebase from 'firebase/compat/app';
import * as messaging from 'firebase/messaging';
import {BehaviorSubject} from 'rxjs';
import {FirebaseService} from './firebase.service';
import {UserService} from '../shared/service/user.service';
import {ToastrService} from 'ngx-toastr';
import {NotificationService} from './notification.service';
import {HttpParams} from '@angular/common/http';
import {NotificationResponseModel} from '../shared/model/response/notification-response.model';

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
  faBell = faBell;
  faTimesCircle = faTimesCircle;
  faBullhorn = faBullhorn;

  user: UserResponseModel;
  isMenuShow: boolean;
  notifications: NotificationResponseModel[];
  subject = new BehaviorSubject(null);

  constructor(private router: Router,
              private userService: UserService,
              private toastService: ToastrService,
              private notificationService: NotificationService,
              private firebaseService: FirebaseService) {
    this.isMenuShow = false;
    const user = localStorage.getItem('user:info');
    if (user) {
      this.user = Object.assign(new UserResponseModel(), JSON.parse(user));
    } else {
      this.router.navigate(['login']).then(() => {
      });
    }
    this.notifications = [];
    this.subject.subscribe(data => {
      if (data != null) {
        const notification = new NotificationResponseModel();
        notification.Title = data.title;
        notification.Message = data.body;
        notification.IsRead = 0;
        notification.IsAll = 0;
        notification.NotificationID = 0;
        notification.Status = 1;
        notification.ID = 1;
        notification.TypeID = 1;
        notification.UserID = this.user.UserID;
        notification.UserCreated = this.user.Code;
        notification.UserUpdated = this.user.UserUpdated;
        this.notificationService.createNotification(notification).subscribe(() => {
        }, () => {
        }, () => {
          this.getNotifications();
        });
      }
    });
  }

  private getNotifications(): void {
    const params = new HttpParams().append('UserID', this.user.UserID.toString());
    this.notificationService.getNotifications(1, 10, params).subscribe(data => {
      this.notifications = data.data.reverse();
    });
  }

  ngOnInit(): void {
    this.getNotifications();

    if (Notification.permission === 'granted') {
      this.registerMessage();
    } else {
      Notification.requestPermission().then((permission: NotificationPermission) => {
        if (permission === 'granted') {
          this.registerMessage();
        }
      });
    }

  }

  private registerMessage(): void {
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const message = messaging.getMessaging(firebaseApp);

    messaging.getToken(message, {
      vapidKey: 'BPYPqxNbCmR_NNt0jxvZskuvUUpkt5OMPP0qYWQvSged5KvOeOyjyx9HkgSGcX9ndUyjOM9FbmXwuktsiQmjWhc',
    }).then((token) => {
      this.firebaseService.subscribeToTopic(token, this.user.UserID).subscribe(res => {
      });
    });

    messaging.onMessage(message, (payload) => {
      this.subject.next(payload.notification);
    });
  }

  closeMenu(): void {
    this.isMenuShow = false;
  }

  readNotification(notification: NotificationResponseModel): void {
    notification.IsRead = 1;
    this.notificationService.updateNotification(notification).subscribe(() => {
    }, () => {
    }, () => {
      this.getNotifications();
    });
  }

  unreadNotifications(): number {
    return this.notifications.filter(notification => !notification.IsRead).length;
  }

  deleteNotification(notification: NotificationResponseModel): void {
    this.notificationService.deleteNotification(notification.NotificationID).subscribe(() => {
    }, () => {
    }, () => {
      this.getNotifications();
    });
  }

  logout(): void {
    this.userService.logout();
  }

  changePassword(): void {
    this.router.navigate(['change-pass']).then();
  }
}
