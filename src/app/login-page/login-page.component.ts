import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserValidator} from '../shared/validator/user.validator';
import {UserModel} from '../shared/model/user.model';
import {UserService} from '../shared/service/user.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  userForm: FormGroup;
  user: UserModel;
  errorMessage: string;
  isLogin = false;

  faSpinner = faSpinner;

  constructor(private userService: UserService, private router: Router) {
    this.user = new UserModel();
    this.userForm = new UserValidator().createFormGroup(new UserModel());
    this.userForm.valueChanges.subscribe(data => {
      Object.assign(this.user, data);
    });
  }

  ngOnInit(): void {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login();
    }
  }

  login(): void {
    this.isLogin = true;
    this.userService.login(this.user)
      .pipe(
        finalize(() => {
          this.isLogin = false;
        })
      )
      .subscribe(data => {
      localStorage.setItem('user:info', JSON.stringify(data));
      this.router.navigate(['category']).then(() => {
      });
    }, () => {
      this.errorMessage = 'Sai thông tin đăng nhập!';
    });
  }
}
