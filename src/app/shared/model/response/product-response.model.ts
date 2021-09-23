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
  ListPrices: any;
}

export class Specific {
  Code: string;
  Description: string;
  ParentID: number;
  ProductID: number;
  SpecID: number;
  SpecName: string;
  SpecParentID: number[];
  Status: number;
}
