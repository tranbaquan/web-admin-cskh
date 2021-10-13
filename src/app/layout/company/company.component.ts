import {Component, OnInit} from '@angular/core';
import {Pagination} from '../../shared/model/pagination';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {faPlus, faSearch, faSpinner, faTimesCircle, faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {CompanyResponseModel} from '../../shared/model/response/company-response.model';
import {CompanyService} from './company.service';
import {ModalService} from '../../shared/component/modal/modal.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  faPlus = faPlus;
  faSearch = faSearch;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;

  user: any;
  loading: boolean;
  listCompany: CompanyResponseModel[];
  selectedCompany: CompanyResponseModel;
  pagination: Pagination<any>;
  createCompanyFormGroup: FormGroup;
  page: number;
  size: number;

  codeError: string;
  nameError: string;
  taxError: string;

  constructor(private companyService: CompanyService,
              private modalService: ModalService,
              private toastService: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('user:info'));
    this.page = 1;
    this.size = 30;
    this.pagination = new Pagination<any>();
    this.listCompany = [];
    this.createCompanyFormGroup = new FormGroup({
      companyCode: new FormControl(''),
      companyName: new FormControl(''),
      companyAddress: new FormControl(''),
      taxCode: new FormControl(''),
      bankCode: new FormControl(''),
      bankOpen: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getAllCompany();
  }

  getAllCompany(): void {
    this.companyService.getAllCompany(this.page, this.size)
      .subscribe(data => {
        const pagination = new Pagination<CompanyResponseModel>();
        pagination.totalItem = data.data.totals;
        pagination.page = this.page;
        pagination.size = this.size;
        pagination.totalPage = Math.ceil(data.data.totals / this.size);
        pagination.data = data.data.data.map(obj => Object.assign(new CompanyResponseModel(), obj));
        this.pagination = pagination;
        this.listCompany = pagination.data;
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.getAllCompany();
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  closeUpdateModal(): void {
    this.modalService.close('update-company-modal');
  }

  openModal(id: string): void {
    this.taxError = '';
    this.nameError = '';
    this.codeError = '';
    this.modalService.open(id);
  }

  validateCode($event): void {
    this.codeError = '';
    if (!$event.target.value.trim()) {
      this.codeError = 'chưa nhập Code';
    }
  }

  validateName($event): void {
    this.nameError = '';
    if (!$event.target.value.trim()) {
      this.nameError = 'chưa nhập tên công ty';
    }
  }

  validateTax($event): void {
    this.taxError = '';
    if (!$event.target.value.trim()) {
      this.taxError = 'chưa nhập Tax';
    }
  }

  validate(model: CompanyResponseModel): void {
    this.taxError = '';
    this.nameError = '';
    this.codeError = '';
    if (!model.CompanyCode.trim()) {
      this.codeError = 'chưa nhập Code';
    }
    if (!model.CompanyName.trim()) {
      this.nameError = 'chưa nhập tên công ty';
    }
    if (!model.TaxCode.trim()) {
      this.taxError = 'chưa nhập Tax';
    }
  }

  createCompany(): void {
    const company = new CompanyResponseModel();
    company.CompanyCode = this.createCompanyFormGroup.get('companyCode').value;
    company.CompanyName = this.createCompanyFormGroup.get('companyName').value;
    company.CompanyAddress = this.createCompanyFormGroup.get('companyAddress').value;
    company.TaxCode = this.createCompanyFormGroup.get('taxCode').value;
    company.CodeBank = this.createCompanyFormGroup.get('bankCode').value;
    company.BankOpen = this.createCompanyFormGroup.get('bankOpen').value;
    if (this.user) {
      company.UserCreated = this.user.Code;
      company.UserCreated = this.user.Code;
    }
    this.validate(company);
    if (this.codeError || this.taxError || this.nameError) {
      return;
    }
    this.companyService.createCompany(company)
      .subscribe(data => {
        this.closeUpdateModal();
        window.location.reload();
      },
        error => {
        this.toastService.warning(error.error.message, 'Tạo thất bại');
        });
  }

  deleteCompany(companyName: string, companyID: number): void {
    if (window.confirm('Xóa công ty: ' + companyName + ' ?')) {
      this.companyService.deleteCompany(companyID)
        .subscribe(data => {
          window.location.reload();
        });
    }
  }

  openEditCompany(item: CompanyResponseModel): void {
    this.selectedCompany = this.cloneItem(item);
    this.openModal('update-company-modal');
  }

  updateCompany(): void {
    if (!this.selectedCompany) {
      return;
    }
    if (this.user) {
      this.selectedCompany.UserUpdated = this.user.Code;
    }
    this.validate(this.selectedCompany);
    if (this.codeError || this.taxError || this.nameError) {
      return;
    }
    this.companyService.updateCompany(this.selectedCompany)
      .subscribe(data => {
          this.selectedCompany = null;
          this.modalService.close('update-company-modal');
          window.location.reload();
        },
        error => {
          this.toastService.warning(error.error.message, 'Cập nhật thật bại!');
        });
  }

  cloneItem(company: CompanyResponseModel): CompanyResponseModel {
    return Object.assign(new CompanyResponseModel(), company);
  }
}
