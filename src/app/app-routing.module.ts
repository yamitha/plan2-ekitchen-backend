import { CouponsComponent } from './coupons/coupons.component';
import { CustomersComponent } from './customers/customers.component';
import { ItemsComponent } from './items/items.component';
import { CompanyComponent } from './company/company.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [{
    path: 'login',
    component: LoginComponent
  }, {
    path: 'kitchens',
    component: KitchenComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'events',
    component: EventComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'items',
    component: ItemsComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },{
    path: 'coupons',
    component: CouponsComponent,
    canActivate: [AuthGuard]
  }, {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
