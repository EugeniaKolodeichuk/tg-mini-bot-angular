import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

interface TgButton {
  show(): void;
  hide(): void;
  setText(text: string): void;
  onClick(fn: Function): void;
  offClick(fn: Function): void;
  enable(): void;
  disable(): void;
}

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private window;
  private tg;

  constructor(
    @Inject(DOCUMENT) private _document: Document) {
    this.window = this._document.defaultView || window;
    this.tg = this.window.Telegram.WebApp;
  }

  get MainButton(): TgButton | null {
    return this.tg?.MainButton || null;
  }

  get BackButton(): TgButton | null {
    return this.tg?.BackButton || null;
  }

  sendData(data: object) {
    this.tg.sendData(JSON.stringify(data));
  }

  ready() {
    this.tg?.ready();
  }
}
