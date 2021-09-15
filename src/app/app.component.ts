import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading: boolean;

  constructor() {
    this.isLoading = true;
  }

  hideSplash(): void {
    this.isLoading = false;
  }
}
