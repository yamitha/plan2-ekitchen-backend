import { ToasterService } from './../_services/toaster.service';
import { Event } from './../_models/event';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  newEvent: Event = {
    eventId: '',
    email: '',
    password: '',
    eventName: '',
    description: '',
    logoUrl: '',
    logoReference: '',
    open: true,
    addedOn: '',
    url: '',
    showOnMenu: true,
    whatsappNumber: '',
    addedBy: '',
  };

  eventsRef: firebase.database.Reference;
  itemsRef: firebase.database.Reference;

  eventsList: Array<any>;
  itemsList: Array<any>;

  loadedEventsList: Array<any>;

  searchTerm = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.eventsRef = firebase.database().ref('/events');
    this.itemsRef = firebase.database().ref('/items');

    this.eventsRef.on('value', eventsList => {
      const events = [];

      eventsList.forEach(event => {
        events.push({
          eventId: event.key,
          eventName: event.val().eventName,
          whatsappNumber: event.val().whatsappNumber,
          email: event.val().email,
          addedOn: event.val().addedOn,
          addedBy: event.val().addedBy,
          logoUrl: event.val().logoUrl,
          open: event.val().open,
          url: event.val().url
        });
        return false;
      })

      this.eventsList = events;
      this.loadedEventsList = events;
    });

    this.itemsRef.on('value', itemsList => {
      const items = [];
      itemsList.forEach(item => {
        items.push({
          itemName: item.val().itemName,
          eventId: item.val().eventId,
          eventName: item.val().eventName,
        });
        return false;
      })
      this.itemsList = items;
    });
  }

  ngOnInit() {
  }

  addUser(event) {

    // phone number validation
    let valid = false;
    let error = '';

    // check if theres any strings
    if (/^\d+$/.test(this.newEvent.whatsappNumber)) {
      if (this.newEvent.whatsappNumber.startsWith('0')) {
        if (this.newEvent.whatsappNumber.length === 10) {
          valid = true;
        } else {
          error = 'Invalid Whatsapp number';
        }
      } else {
        if (this.newEvent.whatsappNumber.length === 9) {
          valid = true;
        } else {
          error = 'Invalid Whatsapp number';
        }
      }
      // check if the length is between range
    } else {
      error = 'Please enter a valid Whatsapp number';
    }

    if (valid) {
      // setting role
      this.afAuth.auth.createUserWithEmailAndPassword(this.newEvent.email, this.newEvent.password).then((addedUser) => {
        console.log(addedUser);

        // generating url
        this.newEvent.url = this.newEvent.eventName;
        this.newEvent.url = this.newEvent.url.replace(/\s+/g, '-').replace('\'', '').toLowerCase();

        this.afDb.object('events/' + addedUser.uid).set({
          eventId: addedUser.uid,
          email: this.newEvent.email,
          eventName: this.newEvent.eventName,
          description: this.newEvent.description,
          logoUrl: this.newEvent.logoUrl,
          logoReference: this.newEvent.logoReference,
          open: this.newEvent.open,
          addedOn: new Date().toISOString(),
          url: this.newEvent.url,
          showOnMenu: this.newEvent.showOnMenu,
          whatsappNumber: '94' + this.newEvent.whatsappNumber,
          addedBy: this.userService.getUser().fullName
        }).then((res) => {
          this.toaster.addToastSuccess('Added Event Successfully', '');
          event.resetForm();
          this.errorMessage = '';
          this.router.navigate(['/login']);
        }).catch(err => {
          // this.toaster.addToastError('Error', err.message);
          this.errorMessage = err.message;
        })
      }).catch(err => {
        // this.toaster.addToastError('Error', err.message);
        this.errorMessage = err.message;
      })
    } else {
      this.errorMessage = error;
    }
  }

  deleteEvent(event) {
    const eventRef = firebase.database().ref('events').child(event.eventId);
    let itemsExist = false;

    this.itemsList.forEach(item => {
      if (item.eventId === event.eventId) {
        itemsExist = true;
        return;
      }
    });

    if (!itemsExist) {
      eventRef.remove().then(_ => {
        this.toaster.addToastSuccess('Event Deleted', '');
      })
    } else {
      this.toaster.addToastError('This event has coupons, delete the coupons to delete the event', '');
    }
  }

}