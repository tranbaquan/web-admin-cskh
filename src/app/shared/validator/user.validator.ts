import {Validator} from './validator';
import {UserModel} from '../model/user.model';
import {FormControl, FormGroup} from '@angular/forms';

export class UserValidator extends Validator<UserModel> {
  createFormGroup(model: UserModel): FormGroup {
    return new FormGroup({
      UserName: new FormControl(),
      PassWord: new FormControl()
    });
  }
}
