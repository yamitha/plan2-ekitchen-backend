import { FilterOrderPipe } from './_pipes/filter-order.pipe';
import { FilterCustomerPipe } from './_pipes/filter.customer.pipe';
import { FilterItemPipe } from './_pipes/filter-item.pipe';
import { FilterCouponPipe } from './_pipes/filter-coupon.pipe';
import { FilterKitchenPipe } from './_pipes/filter-kitchen.pipe';
import { FilterEventPipe } from './_pipes/filter-event.pipe';
import { ToasterService } from './_services/toaster.service';
import { UserService } from './_services/user.service';
import { AuthGuard } from './_guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from './../environments/environment';
import { NavigationComponent } from './navigation/navigation.component';

import { HomeComponent } from './home/home.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { EventComponent } from './event/event.component';
import { CompanyComponent } from './company/company.component';
import { ItemsComponent } from './items/items.component';
import { CustomersComponent } from './customers/customers.component';
import { SettingsComponent } from './settings/settings.component';
import { ToastyModule } from 'ng2-toasty';
import { NgSelectizeModule } from 'ng-selectize';
import { CouponsComponent } from './coupons/coupons.component';
import { QuillEditorModule } from 'ngx-quill-editor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    KitchenComponent,
    EventComponent,
    CompanyComponent,
    ItemsComponent,
    CouponsComponent,
    CustomersComponent,
    SettingsComponent,
    FilterKitchenPipe,
    FilterEventPipe,
    FilterItemPipe,
    FilterCouponPipe,
    FilterCustomerPipe,
    FilterOrderPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ToastyModule.forRoot(),
    NgSelectizeModule,
    QuillEditorModule
  ],
  providers: [
    AuthGuard,
    UserService,
    ToasterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
