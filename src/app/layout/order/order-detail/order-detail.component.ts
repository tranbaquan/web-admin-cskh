import {Component, Input, OnInit} from '@angular/core';
import {OrderResponseModel} from '../../../shared/model/response/order-response.model';
import {ActivatedRoute, Router} from '@angular/router';
import {faWindowClose, faSpinner, faFilePdf, faSave, faTrashAlt, faTimesCircle, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {OrderService} from '../order.service';
import {ModalService} from '../../../shared/component/modal/modal.service';
import {OrderDetail} from '../../../shared/model/order-detail.model';
import {FormControl, FormGroup} from '@angular/forms';
import {OrderStatusModel} from '../../../shared/model/order-status.model';
import {finalize} from 'rxjs/operators';
import {StoreService} from '../../../shared/service/store.service';
import {StoreResponseModel} from '../../../shared/model/response/store-response.model';
import { ViewportScroller } from '@angular/common';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order: OrderResponseModel;
  orderDetailForm: FormGroup;
  isLoadingUpdate: boolean;
  listStores: StoreResponseModel[];

  selectedProduct: OrderDetail;
  priceTemp = 0;
  totalTemp = 0;
  priceForm: FormGroup;
  priceErrorMessage: string;

  faPaperPlane = faPaperPlane;
  faWindowClose = faWindowClose;
  faFilePdf = faFilePdf;
  faTrashAlt = faTrashAlt;
  faSave = faSave;
  faTimesCircle = faTimesCircle;
  faSpinner = faSpinner;

  constructor(private activateRoute: ActivatedRoute,
              private router: Router,
              private orderService: OrderService,
              private modalService: ModalService,
              private storeService: StoreService,
              private viewportScroller: ViewportScroller) {
    this.isLoadingUpdate = false;
  }

  ngOnInit(): void {
    this.order = this.activateRoute.snapshot.data.order;
    this.getListStores();
    this.initOrderForm();
    this.initPriceForm();
  }

  getListStores(): void {
    this.listStores = [];
    this.storeService.getAllStore()
      .subscribe(data => {
        this.listStores = data.data.data.map(obj => Object.assign(new StoreResponseModel(), obj));
      });
  }

  openModal(id: string): void {
    this.modalService.open(id);
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }

  openModalPrice(item: OrderDetail): void {
    this.selectedProduct = item;
    this.initPriceForm();
    this.modalService.open('price-modal');
  }

  closeModalPrice(): void {
    this.priceTemp = 0;
    this.totalTemp = 0;
    this.modalService.close('price-modal');
  }

  getOrderStatusId(): number {
    const orderStatusModal = this.orderService.getStatusByOrder(this.order);
    if (orderStatusModal) {
      return orderStatusModal.id;
    }
    return 0;
  }

  initOrderForm(): void {
    this.orderDetailForm = new FormGroup({
      store: new FormControl(this.order.StoreID),
      customerName: new FormControl(this.order.NameCustomer),
      status: new FormControl(this.getOrderStatusId()),
      vat: new FormControl(this.order.VAT),
      deliveryType: new FormControl(this.order.TypeDelivery),
      paymentType: new FormControl(this.order.TypePayment),
      message: new FormControl(this.order.Message),
      description: new FormControl(this.order.Description),
      address: new FormControl(this.order.AddressReceive)
    });
  }

  initPriceForm(): void {
    this.priceForm = new FormGroup({
      price: new FormControl(),
      total: new FormControl()
    });
  }

  saveOrder(): void {
    const order = Object.assign({} as OrderResponseModel, this.order);
    order.StoreID = this.orderDetailForm.get('store').value;
    order.NameCustomer = this.orderDetailForm.get('customerName').value;
    order.VAT = this.orderDetailForm.get('vat').value;
    order.TypeDelivery = this.orderDetailForm.get('deliveryType').value;
    order.TypePayment = this.orderDetailForm.get('paymentType').value;
    order.Message = this.orderDetailForm.get('message').value;
    order.Description = this.orderDetailForm.get('description').value;
    order.AddressReceive = this.orderDetailForm.get('address').value;
    this.isLoadingUpdate = true;
    this.orderService.updateOrder(order)
      .pipe(
        finalize(() => {
          this.isLoadingUpdate = false;
        })
      ).subscribe(data => {
    });

    // updates status
    const orderStatusModal = this.orderService.getStatusByStatusId(Number(this.orderDetailForm.get('status').value));
    if (orderStatusModal) {
      this.orderService.updateOrderStatus(order.ExportID, orderStatusModal.statusId, orderStatusModal.isAccept)
        .subscribe(data => {
        });
    }
    window.location.reload();
  }

  changePrice(): void {
    this.priceErrorMessage = '';
    this.priceTemp = Number(this.priceForm.get('price').value.replace(/[,]+/g, ''));
    if (!this.priceTemp) {
      this.priceErrorMessage = 'Giá không hợp lệ';
    }
    this.totalTemp = this.priceTemp * this.selectedProduct.Quantity;
  }

  savePrice(): void {
    this.priceErrorMessage = '';
    if (this.totalTemp > 0 && this.priceTemp) {
      this.selectedProduct.Amount = this.priceTemp;
      this.selectedProduct.Total = this.totalTemp;
      this.orderService.updateProductDetail(this.selectedProduct)
        .subscribe(data => {
        });
      this.priceTemp = 0;
      this.totalTemp = 0;
      this.modalService.close('price-modal');
    } else {
      this.priceErrorMessage = 'chưa nhập giá';
    }
  }

  gotoPriceSection(): void {
    this.viewportScroller.scrollToAnchor('productList');
  }
}
