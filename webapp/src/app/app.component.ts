import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
  <h1>{{title | uppercase}}</h1>
  <button (click)="title = 'Updated Title'">Update Title</button>
  `,
})
export class AppComponent {
  title = 'webapp';
}
