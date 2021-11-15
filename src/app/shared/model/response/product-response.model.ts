export class ProductResponseModel {
  ProductID: number;
  TypeProductID: number;
  Color: string;
  Code: string;
  NameProduct: string;
  Unit: string;
  AmountBuy: number;
  AmountSale: number;
  AmountSaleMuilti: number;
  AmountPromotion: number;
  FIFO: number;
  Description: string;
  ShortDescription: string;
  DateProduction: Date;
  DateExpired: Date;
  Status: number;
  ImagesPath: string[];
  IsHome: boolean;
  IsStandard: boolean;
  IsBestSell: boolean;
  IsSpecical: boolean;
  Order: number;
  MinQuantity: number;
  DiscountProvider: number;
  InformationTech: string;
  Rating: number;
  CountNumberRating: number;
  ListSpec1: Specific[];
  ListSpec2: Specific[];
  ListSpec3: Specific[];
  ListProduction: any;
  ListPrices: any[];
  UserCreated: string;
  UserUpdated: string;

  constructor() {
    this.ProductID = 0;
    this.TypeProductID = 0;
    this.Color = '';
    this.Code = new Date().getTime().toString();
    this.NameProduct = '';
    this.Unit = '';
    this.AmountBuy = 0;
    this.AmountSale = 0;
    this.AmountSaleMuilti = 0;
    this.AmountPromotion = 0;
    this.FIFO = 0;
    this.ShortDescription = '';
    this.Description = '';
    this.DateProduction = new Date();
    this.DateExpired = new Date();
    this.Status = 0;
    this.ImagesPath = [];
    this.IsHome = false;
    this.IsStandard = false;
    this.IsBestSell = false;
    this.IsSpecical = false;
    this.Order = 0;
    this.MinQuantity = 1;
    this.DiscountProvider = 0;
    this.InformationTech = '[]';
    this.Rating = 0;
    this.CountNumberRating = 0;
    this.ListSpec1 = [];
    this.ListSpec2 = [];
    this.ListSpec3 = [];
    this.ListProduction = [];
    this.ListPrices = [];
    this.UserCreated = '';
    this.UserUpdated = '';
  }
}

export class Specific {
  Code: string;
  Description: string;
  ParentID: number;
  ProductID: number;
  SpecID: number;
  SpecName: string;
  TypeSpec: number;
  SpecParentID: number[];
  Status: number;
  UserCreated: string;
  UserUpdated: string;
}
