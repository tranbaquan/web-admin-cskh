import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-modal-body',
  templateUrl: './modal-body.component.html',
  styleUrls: ['./modal-body.component.scss']
})
export class ModalBodyComponent implements OnInit {
  @Input() normalPadding = false;
  @Input() separated = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
