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


  constructor() {
    this.pagination = new Pagination<any>();
    this.maxPage = 9;
    this.previousDisabled = false;
    this.nextDisabled = false;
    this.pageList = [];
  }

  ngOnInit(): void {
    this.currentPage = this.pagination.page;
    if (this.currentPage) {
      this.updateDisplayRange();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentPage = this.pagination.page;
    if (this.currentPage) {
      this.updateDisplayRange();
    }
  }

  updateDisplayRange(): void {
    const distance = Math.floor(this.maxPage / 2);
    if (this.currentPage < distance) {
      this.startPage = 1;
      this.endPage = this.startPage + this.maxPage;
    } else if (this.currentPage > this.pagination.totalPage - distance) {
      this.endPage = this.pagination.totalPage;
      this.startPage = this.endPage - this.maxPage;
    } else {
      this.startPage = this.currentPage - distance;
      this.endPage = this.currentPage + distance;
    }

    this.startPage = this.startPage > 1 ? this.startPage : 1;
    this.endPage = this.pagination.totalPage < this.endPage ? this.pagination.totalPage : this.endPage;
    this.previousDisabled = this.currentPage === 1;
    this.nextDisabled = this.currentPage === this.pagination.totalPage;
    this.pageList = Array(this.endPage - this.startPage + 1).fill(0).map((x, i) => i + this.startPage);
  }

  updateCurrentPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayRange();
    this.pageChange.emit(page);
  }
}
