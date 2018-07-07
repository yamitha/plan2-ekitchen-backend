import { ToasterService } from './../_services/toaster.service';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  panel = 1;
  todaysOrders = 0;
  oldOrders = 0;

  ordersList: FirebaseListObservable<any>;
  orders = [];

  todaysDate = new Date();

  searchTerm = '';

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService,
    private afDatabase: AngularFireDatabase
  ) {
    this.ordersList = this.afDb.list('/orders', {preserveSnapshot: true});

    this.ordersList.subscribe(orders => {
      orders.forEach(order => {
        this.orders.push({
          orderId: order.val().orderId,
          orderDateTime: this.parseISOString(order.val().orderDateTime),
          customerId: order.val().customerId,
          customerName: order.val().customerName,
          deliveryAddress: order.val().deliveryAddress,
          customerContactNumber: order.val().customerContactNumber,
          kitchenId: order.val().kitchenId,
          kitchenName: order.val().kitchenName,
          kitchenWhatsappNumber: order.val().kitchenWhatsappNumber,
          eventId: order.val().eventId,
          eventName: order.val().eventName,
          eventWhatsappNumber: order.val().eventWhatsappNumber,
          items: order.val().items,
          numberOfItems: order.val().numberOfItems,
          events: order.val().events,
          numberOfEvents: order.val().numberOfEvents,
          orderTotal: order.val().orderTotal,
          cancelled: order.val().cancelled,
          reasonForCancelling: order.val().reasonForCancelling,
          completed: order.val().completed,
          paymentMethod: order.val().paymentMethod,
          paid: order.val().paid,
          transactionAmount: order.val().transactionAmount
        })
      });

      this.segregate(this.orders);

    });
  }

  ngOnInit() {
  }

  segregate(ordersList) {
    this.todaysOrders = 0;
    this.oldOrders = 0;

    ordersList.forEach(order => {
      if (order.orderDateTime.setHours(0, 0, 0, 0) === this.todaysDate.setHours(0, 0, 0, 0)) {
        this.todaysOrders = this.todaysOrders + 1;
      } else {
        this.oldOrders = this.oldOrders + 1;
      }
    });
  }

  parseISOString(s) {
    const b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

}
