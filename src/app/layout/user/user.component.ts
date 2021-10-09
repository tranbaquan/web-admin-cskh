import {Component, OnInit} from '@angular/core';
import {faPlus, faSearch, faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {Pagination} from '../../shared/model/pagination';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalService} from '../../shared/component/modal/modal.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;

  loading: boolean;
  searchQuery: string;
  users: any[];
  pagination: Pagination<any>;
  createUserFormGroup: FormGroup;

  constructor(private modalService: ModalService) {
    this.pagination = new Pagination<any>();
    this.users = [];
    this.searchQuery = '';
    this.createUserFormGroup = new FormGroup({
      UserName: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {

  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  createUser(): void {

  }
}
