import { Component, inject } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';
import { ProductsService } from '../../services/products.service';
import { ProductListComponent } from '../../components/product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductListComponent],
  template: `
  <app-product-list
    title="Skills"
    subtitle="Focused skill courses to level up your stack"
    [products]="products.byGroup['skill']"
  ></app-product-list>
  <app-product-list
    title="Intensives"
    subtitle="Hands-on projects to put your knowledge into practice"
    [products]="products.byGroup['intensive']"
  ></app-product-list>
  <app-product-list
    title="Courses"
    subtitle="Structured learning paths from scratch to job-ready"
    [products]="products.byGroup['course']"
  ></app-product-list>`,
})
export class ShopComponent {
  telegram = inject(TelegramService);
  products = inject(ProductsService);

  constructor() {
    this.telegram.BackButton.hide();
    console.log('products', this.products.byGroup)
  }
}
