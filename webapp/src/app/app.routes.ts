import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { ProductComponent } from './pages/product/product.component';
import { InterviewPrepComponent } from './pages/interview-prep/interview-prep.component';

export const routes: Routes = [
    {path: '', component: ShopComponent, pathMatch: 'full'},
    {path: 'feedback', component: FeedbackComponent},
    {path: 'product/:id', component: ProductComponent},
    {path: 'interview-prep', component: InterviewPrepComponent},
];
