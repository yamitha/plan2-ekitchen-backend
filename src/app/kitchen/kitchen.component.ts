import { ToasterService } from './../_services/toaster.service';
import { Kitchen } from './../_models/kitchen';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  newKitchen: Kitchen = {
    kitchenId: '',
    email: '',
    password: '',
    kitchenName: '',
    description: '',
    logoUrl: '',
    logoReference: '',
    open: true,
    addedOn: '',
    url: '',
    showOnMenu: true,
    transactionPercentage: 0,
    whatsappNumber: '',
    addedBy: '',
  };

  kitchensRef: firebase.database.Reference;
  itemsRef: firebase.database.Reference;

  kitchensList: Array<any>;
  itemsList: Array<any>;

  loadedKitchensList: Array<any>;

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
    this.kitchensRef = firebase.database().ref('/kitchens');
    this.itemsRef = firebase.database().ref('/items');

    this.kitchensRef.on('value', kitchensList => {
      const kitchens = [];

      kitchensList.forEach(kitchen => {
        kitchens.push({
          kitchenId: kitchen.key,
          kitchenName: kitchen.val().kitchenName,
          whatsappNumber: kitchen.val().whatsappNumber,
          email: kitchen.val().email,
          addedOn: kitchen.val().addedOn,
          addedBy: kitchen.val().addedBy,
          logoUrl: kitchen.val().logoUrl,
          open: kitchen.val().open,
          transactionPercentage: kitchen.val().transactionPercentage,
          url: kitchen.val().url
        });
        return false;
      })

      this.kitchensList = kitchens;
      this.loadedKitchensList = kitchens;
    });

    this.itemsRef.on('value', itemsList => {
      const items = [];
      itemsList.forEach(item => {
        items.push({
          itemName: item.val().itemName,
          kitchenId: item.val().kitchenId,
          kitchenName: item.val().kitchenName,
        });
        return false;
      })
      this.itemsList = items;
    });
  }

  ngOnInit() {
  }

  addUser(kitchen) {

    // phone number validation
    let valid = false;
    let error = '';

    // check if theres any strings
    if (/^\d+$/.test(this.newKitchen.whatsappNumber)) {
      if (this.newKitchen.whatsappNumber.startsWith('0')) {
        if (this.newKitchen.whatsappNumber.length === 10) {
          valid = true;
        } else {
          error = 'Invalid Whatsapp number';
        }
      } else {
        if (this.newKitchen.whatsappNumber.length === 9) {
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
      this.afAuth.auth.createUserWithEmailAndPassword(this.newKitchen.email, this.newKitchen.password).then((addedUser) => {
        console.log(addedUser);

        // generating url
        this.newKitchen.url = this.newKitchen.kitchenName;
        this.newKitchen.url = this.newKitchen.url.replace(/\s+/g, '-').replace('\'', '').toLowerCase();

        this.afDb.object('kitchens/' + addedUser.uid).set({
          kitchenId: addedUser.uid,
          email: this.newKitchen.email,
          kitchenName: this.newKitchen.kitchenName,
          description: this.newKitchen.description,
          logoUrl: this.newKitchen.logoUrl,
          logoReference: this.newKitchen.logoReference,
          open: this.newKitchen.open,
          addedOn: new Date().toISOString(),
          url: this.newKitchen.url,
          showOnMenu: this.newKitchen.showOnMenu,
          transactionPercentage: this.newKitchen.transactionPercentage,
          whatsappNumber: '94' + this.newKitchen.whatsappNumber,
          addedBy: this.userService.getUser().fullName
        }).then((res) => {
          this.toaster.addToastSuccess('Added Kitchen Successfully', '');
          kitchen.resetForm();
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

  deleteKitchen(kitchen) {
    const kitchenRef = firebase.database().ref('kitchens').child(kitchen.kitchenId);
    let itemsExist = false;

    this.itemsList.forEach(item => {
      if (item.kitchenId === kitchen.kitchenId) {
        itemsExist = true;
        return;
      }
    });

    if (!itemsExist) {
      kitchenRef.remove().then(_ => {
        this.toaster.addToastSuccess('Kitchen Deleted', '');
      })
    } else {
      this.toaster.addToastError('This kitchen has items, delete the items to delete the kitchen', '');
    }
  }

}
