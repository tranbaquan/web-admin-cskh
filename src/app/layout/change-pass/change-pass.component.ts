import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/service/user.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  isShowPassword = false;
  password: string;
  newPass: string;
  reNewPass: string;
  errorPass: string;
  errorNew: string;
  errorRe: string;
  error: string;
  isChanging = false;

  user: any;
  faSpinner = faSpinner;

  constructor(private userService: UserService,
              private toastService: ToastrService,
              private route: Router) {
    this.user = JSON.parse(localStorage.getItem('user:info'));
  }

  ngOnInit(): void {
  }

  changePassword(): void {
    this.error = '';
    if (this.validate()) {
      this.isChanging = true;
      this.userService.changePassworl(this.user.Code, this.password, this.newPass)
        .pipe(
          finalize(() => {
            this.isChanging = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Đổi mật khẩu thành công!');
          this.route.navigate(['category']).then();
        }, error => {
          this.error = error.error.message;
          }
        );
    }
  }

  validatePass(): boolean {
    if (this.password) {
      this.errorPass = '';
      return true;
    } else {
      this.errorPass = 'Chưa nhập mật khẩu cũ.';
      return false;
    }
  }

  validateNewPass(): boolean {
    if (this.newPass) {
      this.errorNew = '';
      return true;
    } else {
      this.errorNew = 'Chưa nhập mật khẩu mới.';
      return false;
    }
  }

  validateRePass(): boolean {
    if (this.reNewPass) {
      if (this.newPass === this.reNewPass) {
        this.errorRe = '';
        return true;
      } else {
        this.errorRe = 'Mật khẩu mới không khớp.';
        return false;
      }
    } else {
      this.errorRe = 'Nhập lại mật khẩu mới.';
      return false;
    }
  }

  validate(): boolean {
    const pass = this.validatePass();
    const newPass = this.validateNewPass();
    const re = this.validateRePass();
    return pass && newPass && re;
  }
}
