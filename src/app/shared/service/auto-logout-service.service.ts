import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "./user.service";

const MINUTES_UNITL_AUTO_LOGOUT = 15; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY =  'lastAction';
@Injectable({
  providedIn: 'root'
})
export class AutoLogoutServiceService {

  getLastAction(): number {
    return Number(localStorage.getItem(STORE_KEY));
  }
  setLastAction(lastAction: number): void {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  constructor(private userService: UserService) {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY, Date.now().toString());
  }

  initListener(): void {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset(): void {
    this.setLastAction(Date.now());
  }

  initInterval(): void {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check(): void {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout)  {
      this.userService.logout();
    }
  }
}
