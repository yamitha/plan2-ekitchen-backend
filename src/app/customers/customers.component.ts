import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToasterService } from './../_services/toaster.service';

import * as firebase from 'firebase';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customersRef: firebase.database.Reference;

  customersList: Array<any>;

  searchTerm = '';

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.customersRef = firebase.database().ref('/customers');

    this.customersRef.on('value', customersList => {
      const customers = [];

      customersList.forEach(customer => {
        customers.push({
          fullName: customer.val().fullName,
          email: customer.val().email,
          contactNumber : customer.val().contactNumber,
          address: customer.val().address,
          addedOn: customer.val().addedOn
        });
        return false;
      })

      this.customersList = customers;
    });
  }

  ngOnInit() {
  }

}
