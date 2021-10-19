import {Component} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSplashLoading: boolean;

  isNavigating: boolean;
  progressPercent: number;
  intervalId: any;

  constructor(private router: Router) {
    this.isSplashLoading = true;
    this.registerPageLoading();
  }

  hideSplash(): void {
    this.isSplashLoading = false;
  }

  registerPageLoading(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
        this.progressPercent = 0;
        this.intervalId = setInterval(() => {
          if (this.progressPercent > 70) {
            clearInterval(this.intervalId);
          }
          this.progressPercent += 1;
        }, 20);
      }

      if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        // console.log(event);
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
          if (this.progressPercent >= 100) {
            this.isNavigating = false;
            clearInterval(this.intervalId);
          }
          this.progressPercent += 1;
        }, 15);
      }
    });
  }
}
