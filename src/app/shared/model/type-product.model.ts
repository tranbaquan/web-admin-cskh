export class TypeProductModel {
  TypeProductID: number;
  ParentID: number;
  Code: string;
  NameType: string;
  Description: string;
  ImagesPath: string;
  Status: number;
  Order: number;
  DateUpdated: Date;
  DateCreated: Date;
  UserCreated: string;
  UserUpdated: string;
  listChildren: TypeProductModel[] = [];
  level: number;
}
