import { Item } from './../_models/items';
import { Component, OnInit } from '@angular/core';
import { ToasterService } from './../_services/toaster.service';
import { UserService } from './../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  newItem: Item = {
    itemName: '',
    kitchenId: '',
    kitchenUrl: '',
    price: 0,
    description: '',
    imageUrl: '',
    imageReference: '',
    addedOn: '',
    available: true,
    addedBy: ''
  }

  items: FirebaseListObservable<any[]>;

  kitchensRef: firebase.database.Reference;
  kitchensList: Array<any>;

  itemsRef: firebase.database.Reference;
  itemsList: Array<any>;
  loadedItemsList: Array<any>;

  searchTerm = '';
  errorMessage = '';

  selectize: any = {
    kitchenId : ''
  }

  config = {
    persist: true,
    maxItems: 1,
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
    this.items = afDatabase.list('items');
    this.kitchensRef = firebase.database().ref('/kitchens');
    this.itemsRef = firebase.database().ref('/items');

    this.itemsRef.on('value', itemsList => {
      const items = [];

      itemsList.forEach(item => {
        items.push({
          itemId: item.key,
          itemName: item.val().itemName,
          kitchenId: item.val().kitchenId,
          kitchenUrl: item.val().kitchenUrl,
          price: item.val().price,
          description: item.val().description,
          imageUrl: item.val().imageUrl,
          imageReference: item.val().imageReference,
          addedOn: item.val().addedOn,
          available: item.val().available,
          addedBy: item.val().addedBy
        });
        return false;
      });
      this.itemsList = items;
    });
  }

  ngOnInit() {
    this.populateList();
  }

  populateList() {
    this.kitchensRef.on('value', kitchensList => {
      const kitchens = [];

      kitchensList.forEach(kitchen => {
        kitchens.push({
          id: kitchen.key,
          name: kitchen.val().kitchenName,
        });
        return false;
      });
      this.kitchensList = kitchens;
    });
  }

  onValueChangeKitchen($event) {
    this.newItem.kitchenId = $event;

    const kitchen = this.afDb.object('kitchens/' + this.newItem.kitchenId, {preserveSnapshot: true});

    kitchen.subscribe(snapshot => {
      this.newItem.kitchenUrl = snapshot.val().url
    });
  }

  addItem(item: NgForm) {
      this.newItem.addedOn = new Date().toISOString();
      this.newItem.addedBy = this.userService.getUser().fullName;

      this.items.push(this.newItem).then((addedItem) => {
        this.toaster.addToastSuccess('Added Item Successfully', '');

        item.resetForm({
          itemName: '',
          kitchenId: '',
          kitchenUrl: '',
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

  deleteItem(item) {
    const dbItems = this.afDatabase.list('/items');

    dbItems.remove(item.key).then(() => {
      this.toaster.addToastSuccess('Item deleted', '');
    });

  }

}
