import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {Pagination} from '../../model/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;

  @Input() pagination: Pagination<any>;
  @Input() maxPage: number;

  @Output() pageChange = new EventEmitter<number>();

  currentPage: number;
  startPage: number;
  endPage: number;
  previousDisabled: boolean;
  nextDisabled: boolean;
  pageList: number[];
  currentRange: number;


  constructor() {
    this.pagination = new Pagination<any>();
    this.maxPage = 10;
    this.currentRange = 1;
    this.previousDisabled = false;
    this.nextDisabled = false;
    this.pageList = [];
  }

  ngOnInit(): void {
    this.currentPage = this.pagination.page;
    if (this.currentPage) {
      this.init();
      // this.updateDisplayRange();
    }
  }

  init(): void {
    if (this.currentPage <= this.maxPage) {
      this.currentRange = 0;
      this.previousDisabled = true;
    } else {
      this.currentRange = Math.floor(this.currentPage / this.maxPage);
    }

    this.initRange();
  }

  initRange(): void {
    this.startPage = this.currentRange * this.maxPage + 1;

    if (this.startPage < 1) {
      this.currentRange++;
      this.startPage = 1;
      this.previousDisabled = true;
    }

    this.endPage = this.startPage + this.maxPage - 1;

    if (this.endPage > this.pagination.totalPage) {
      this.currentRange--;
      this.endPage = this.pagination.totalPage;
      this.nextDisabled = true;
    }

    this.pageList = Array(this.endPage - this.startPage + 1).fill(0).map((x, i) => i + this.startPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentPage = this.pagination.page;
    this.previousDisabled = false;
    this.nextDisabled = false;
    if (this.currentPage) {
      this.init();
    }
  }

  //
  // updateDisplayRange(): void {
  //   const distance = Math.floor(this.maxPage / 2);
  //   if (this.currentPage < distance) {
  //     this.startPage = 1;
  //     this.endPage = this.startPage + this.maxPage;
  //   } else if (this.currentPage > this.pagination.totalPage - distance) {
  //     this.endPage = this.pagination.totalPage;
  //     this.startPage = this.endPage - this.maxPage;
  //   } else {
  //     this.startPage = this.currentPage - distance;
  //     this.endPage = this.currentPage + distance;
  //   }
  //
  //   this.startPage = this.startPage > 1 ? this.startPage : 1;
  //   this.endPage = this.pagination.totalPage < this.endPage ? this.pagination.totalPage : this.endPage;
  //   this.previousDisabled = this.currentPage === 1;
  //   this.nextDisabled = this.currentPage === this.pagination.totalPage;
  //   this.pageList = Array(this.endPage - this.startPage + 1).fill(0).map((x, i) => i + this.startPage);
  // }

  updateCurrentPage(page: number): void {
    this.currentPage = page;
    // this.updateDisplayRange();
    this.pageChange.emit(page);
  }

  previousRange(): void {
    this.nextDisabled = false;
    this.currentRange--;
    if (this.currentRange === 0) {
      this.previousDisabled = true;
    }
    this.initRange();

    this.currentPage = this.endPage;
    this.pageChange.emit(this.currentPage);
  }

  nextRange(): void {
    this.previousDisabled = false;
    this.currentRange++;

    this.initRange();

    this.currentPage = this.startPage;
    this.pageChange.emit(this.currentPage);
  }
}
