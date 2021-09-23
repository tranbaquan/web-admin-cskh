import { OrderDetail } from '../order-detail.model';
export class OrderResponseModel {
  ExportID: number;
  StatusID: number;
  TypeExport: number;
  VAT: number;
  SaleID: number;
  StoreID: number;
  CustomerID: string;
  DeliveryStaffID: number;
  Code: string;
  DateExport: Date;
  UserID: number;
  Description: string;
  Message: string;
  AddressReceive: string;
  TypeDelivery: number;
  TypePayment: number;
  IsAccept: number;
  UserApprove: string;
  DateUpdated: Date;
  DateApprove: Date;
  DateCreated: Date;
  UserCreated: string;
  UserUpdated: string;
  NameCustomer: string;
  StoreName: string;
  listOrderDetail: OrderDetail[] ;
}