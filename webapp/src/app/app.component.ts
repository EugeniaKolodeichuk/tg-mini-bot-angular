import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelegramService } from './services/telegram.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet/>`,
  //for educational purposes only, not part of the actual app
  // template: `
  // <h1>{{title | uppercase}}</h1>
  // <button (click)="title = 'Updated Title'">Update Title</button>
  // <ul>
  // @for(item of items; track item) {
  //   <li>{{item}}</li>
  // }
  //   @if(title === 'Updated Title') {
  //   <hr/>}
  // </ul>
  // `,
})
export class AppComponent {
  // title = 'webapp';
  // items = [1, 2, 3, 4, 5]

  telegram = inject(TelegramService);

  constructor() {
    this.telegram.ready();
  }
}
