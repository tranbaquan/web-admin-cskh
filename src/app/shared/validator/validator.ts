import {FormGroup} from '@angular/forms';

export abstract class Validator<T> {
  abstract createFormGroup(model: T): FormGroup;
}
