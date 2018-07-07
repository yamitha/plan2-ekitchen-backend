import { Coupon } from './../_models/coupons';
import { Component, OnInit } from '@angular/core';
import { ToasterService } from './../_services/toaster.service';
import { UserService } from './../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  newCoupon: Coupon = {
    couponName: '',
    eventId: '',
    eventUrl: '',
    price: 0,
    description: '',
    imageUrl: '',
    imageReference: '',
    addedOn: '',
    available: true,
    addedBy: ''
  }

  coupons: FirebaseListObservable<any[]>;

  eventsRef: firebase.database.Reference;
  eventsList: Array<any>;

  couponsRef: firebase.database.Reference;
  couponsList: Array<any>;
  loadedCouponsList: Array<any>;

  searchTerm = '';
  errorMessage = '';

  selectize: any = {
    eventId : ''
  }

  config = {
    persist: true,
    maxCoupons: 1,
    valueField: 'id',
    labelField: 'name',
    searchField: ['name'],
    openOnFocus: true,
    closeAfterSelect: true,
    allowEmptyOption: false,
    preload: true,
    plugins: ['dropdown_direction', 'remove_button']
  };

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService,
    private afDatabase: AngularFireDatabase
  ) {
    this.coupons = afDatabase.list('coupons');
    this.eventsRef = firebase.database().ref('/events');
    this.couponsRef = firebase.database().ref('/coupons');

    this.couponsRef.on('value', couponsList => {
      const coupons = [];

      couponsList.forEach(coupon => {
        coupons.push({
          couponId: coupon.key,
          couponName: coupon.val().couponName,
          eventId: coupon.val().eventId,
          eventUrl: coupon.val().eventUrl,
          price: coupon.val().price,
          description: coupon.val().description,
          imageUrl: coupon.val().imageUrl,
          imageReference: coupon.val().imageReference,
          addedOn: coupon.val().addedOn,
          available: coupon.val().available,
          addedBy: coupon.val().addedBy
        });
        return false;
      });
      this.couponsList = coupons;
    });
  }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    this.eventsRef.on('value', eventsList => {
      const events = [];

      eventsList.forEach(event => {
        events.push({
          id: event.key,
          name: event.val().eventName,
        });
        return false;
      });
      this.eventsList = events;
    });
  }

  onValueChangeEvent($event) {
    this.newCoupon.eventId = $event;

    const event = this.afDb.object('events/' + this.newCoupon.eventId, {preserveSnapshot: true});

    event.subscribe(snapshot => {
      this.newCoupon.eventUrl = snapshot.val().url
    });
  }

  addCoupon(coupon: NgForm) {
      this.newCoupon.addedOn = new Date().toISOString();
      this.newCoupon.addedBy = this.userService.getUser().fullName;

      this.coupons.push(this.newCoupon).then((addedCoupon) => {
        this.toaster.addToastSuccess('Added Coupon Successfully', '');

        coupon.resetForm({
          couponName: '',
          eventId: '',
          eventUrl: '',
          price: 0,
          description: '',
          imageUrl: '',
          imageReference: '',
          addedOn: '',
          available: true,
          addedBy: ''
        });
      });
  }

  deleteCoupon(coupon) {
    const dbCoupons = this.afDatabase.list('/coupons');

    dbCoupons.remove(coupon.key).then(() => {
      this.toaster.addToastSuccess('Coupon deleted', '');
    });

  }

}