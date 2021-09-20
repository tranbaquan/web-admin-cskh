export class Pagination<T> {
  page: number;
  size: number;
  totalItem: number;
  totalPage: number;
  data: T[];

  constructor() {
    this.page = 1;
    this.size = 0;
    this.totalItem = 0;
    this.totalPage = 0;
  }
}
