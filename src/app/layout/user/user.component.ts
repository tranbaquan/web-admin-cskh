import {Component, OnInit} from '@angular/core';
import {faPlus, faSearch, faSpinner, faTrashAlt, faEdit, faTimesCircle, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {Pagination} from '../../shared/model/pagination';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalService} from '../../shared/component/modal/modal.service';
import {UserService} from '../../shared/service/user.service';
import {UserResponseModel} from '../../shared/model/response/user-response.model';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  page: number;
  size: number;
  keySearch: string;
  typeUser: number;
  status: number;
  loading = false;
  updating = false;
  users: any[];
  pagination: Pagination<UserResponseModel>;
  user: any;
  isCreateNew = false;
  selectedUser: UserResponseModel;
  showPassword = false;

  errorType = '';
  errorUserName = '';
  errorPassword = '';
  errorEmail = '';
  errorName = '';

  constructor(private modalService: ModalService,
              private userService: UserService,
              private toastService: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.page = 1;
    this.size = 20;
    this.keySearch = '';
    this.status = 100;
    this.typeUser = 0;
    this.pagination = new Pagination<any>();
    this.users = [];
    this.selectedUser = new UserResponseModel();
  }

  ngOnInit(): void {
    this.searchUsers();
  }

  searchUsers(): void {
    this.loading = true;
    this.userService.getListUser(this.page, this.size, this.keySearch, this.typeUser.toString(), this.status.toString())
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(data => {
        const pagination = new Pagination<UserResponseModel>();
        pagination.totalItem = data.data.totals;
        pagination.page = this.page;
        pagination.size = this.size;
        pagination.totalPage = Math.ceil(data.data.totals / this.size);
        pagination.data = data.data.data.map(obj => Object.assign(new UserResponseModel(), obj));
        this.pagination = pagination;
      }, error => {
        this.toastService.warning(error.error.message, 'Tải dữ thất bại!');
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.searchUsers();
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
    this.isCreateNew = false;
    this.selectedUser = new UserResponseModel();
    this.errorName = '';
    this.errorEmail = '';
    this.errorPassword = '';
    this.errorUserName = '';
    this.errorType = '';
  }

  openUpdateModal(user: UserResponseModel): void {
    const item = this.cloneUser(user);
    this.selectedUser = item;
    this.openModal('create-user-modal');
  }

  openCreateModal(): void {
    this.isCreateNew = true;
    this.openModal('create-user-modal');
  }

  cloneUser(user: UserResponseModel): UserResponseModel {
    return Object.assign(new UserResponseModel(), user);
  }

  isShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  createUser(): void {
    this.selectedUser.UserCreated = this.user.Code;
    this.selectedUser.UserUpdated = this.user.Code;
    if (this.selectedUser.Status) {
      this.selectedUser.Status = 1;
    } else {
      this.selectedUser.Status = 0;
    }
    if (this.validate()) {
      this.updating = true;
      this.userService.createUser(this.selectedUser)
        .pipe(
          finalize(() => {
            this.updating = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Tạo tài khoản thành công!');
          this.closeModal('create-user-modal');
          this.searchUsers();
        }, error => {
          this.toastService.warning(error.error.message, 'Tạo tài khoản thất bại');
        });
    }
  }

  deleteUser(userId: number): void {
    if (window.confirm('Xóa tài khoản: ' + this.selectedUser.Name + ' ?')) {
      this.updating = true;
      this.userService.deleteUser(userId)
        .pipe(
          finalize(() => {
            this.updating = false;
          })
        )
        .subscribe(data => {
          this.toastService.success('Xóa thành công');
          this.closeModal('create-user-modal');
          this.searchUsers();
        }, error => {
          this.toastService.warning(error.error.message, 'Xóa thất bại!');
        });
    }
  }

  updateUser(): void {
    this.selectedUser.UserUpdated = this.user.Code;
    this.updating = true;
    if (this.selectedUser.Status) {
      this.selectedUser.Status = 1;
    } else {
      this.selectedUser.Status = 0;
    }
    this.userService.updateUser(this.selectedUser)
      .pipe(
        finalize(() => {
          this.updating = false;
        })
      )
      .subscribe(data => {
        this.toastService.success('Lưu thành công!');
        this.closeModal('create-user-modal');
        this.searchUsers();
      }, error => {
        this.toastService.warning(error.error.message, 'Lưu thất bại!');
      });
  }

  validateType(): boolean {
    if (this.selectedUser.TypeUser) {
      this.errorType = '';
      return true;
    } else {
      this.errorType = 'chưa nhập loại tài khoản.';
      return false;
    }
  }

  validateUserName(): boolean {
    if (this.selectedUser.Code) {
      this.errorUserName = '';
      return true;
    } else {
      this.errorUserName = 'chưa nhập tên đăng nhập.';
      return false;
    }
  }

  validatePassword(): boolean {
    if (this.selectedUser.Password) {
      this.errorPassword = '';
      return true;
    } else {
      this.errorPassword = 'chưa nhập mật khẩu.';
      return false;
    }
  }

  validateEmail(): boolean {
    if (this.selectedUser.Email) {
      if (this.regexMail(this.selectedUser.Email)) {
        this.errorEmail = '';
        return true;
      } else {
        this.errorEmail = 'mail không hợp lệ.';
        return false;
      }
    } else {
      this.errorEmail = 'chưa nhập mail.';
      return false;
    }
  }

  validateName(): boolean {
    if (this.selectedUser.Name) {
      this.errorName = '';
      return true;
    } else {
      this.errorName = 'chưa nhập tên dầy đủ.';
      return false;
    }
  }

  validate(): boolean {
    const mail = this.validateEmail();
    const pass = this.validatePassword();
    const type = this.validateType();
    const UN = this.validateUserName();
    const name = this.validateName();
    return mail && pass && type && UN && name;
  }

  regexMail(email): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
