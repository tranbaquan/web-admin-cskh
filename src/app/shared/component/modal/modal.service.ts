import {Injectable} from '@angular/core';
import {ModalComponent} from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modals: ModalComponent[];
  visibleModals: ModalComponent[];
  backdrop: HTMLElement;

  constructor() {
    this.modals = [];
    this.visibleModals = [];
  }

  add(modal: ModalComponent): void {
    this.modals.push(modal);
  }

  remove(id: string): void {
    this.modals = this.modals.filter(modal => modal.id !== id);
  }

  open(id: string): void {
    const isNotOpen = this.visibleModals.filter(modal => modal.id === id).length === 0;
    if (isNotOpen) {
      const modalFound = this.modals.find(modal => modal.id === id);
      this.visibleModals.push(modalFound);
      this.showBackdrop();
      modalFound.open();
    }
  }

  close(id: string): void {
    const modalFound = this.modals.find(modal => modal.id === id);
    setTimeout(() => {
      this.hideBackdrop();
    });
    if (modalFound) {
      modalFound.close();
    }
    setTimeout(() => {
      this.visibleModals = this.visibleModals.filter(modal => modal.id !== id);
    }, 200);
  }

  showBackdrop(): void {
    if (this.visibleModals.length === 1) {
      document.body.insertAdjacentHTML('beforeend', '<div class="core-modal-backdrop"></div>');
      this.backdrop = document.body.querySelector('.core-modal-backdrop');
    }

    setTimeout(() => {
      this.backdrop.classList.add('core-fade');
      document.body.classList.add('core-modal-show');
    }, 10);
  }

  hideBackdrop(): void {
    if (this.visibleModals.length === 1) {
      this.backdrop.classList.remove('core-fade');
      setTimeout(() => {
        this.backdrop.remove();
        document.body.classList.remove('core-modal-show');
      }, 200);
    }
  }

}
