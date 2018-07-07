import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { ToasterService } from '../_services/toaster.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  newUser: any = {
    fullName: '',
    email: '',
    password: '',
    roles: {
      administrator: false,
      customer: false,
      kitchen: false,
      event: false
    }
  }

  ekitchen: any = {
    globalOrdering: false,
    globalOrderingReason: ''
  }

  usersRef: firebase.database.Reference;
  usersList: Array<any>;
  loadedUsersList: Array<any>;

  errorMessage = '';

  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.usersRef = firebase.database().ref('/users');

    this.usersRef.on('value', usersList => {
      const users = [];
      usersList.forEach(user => {
        users.push({
          key: user.key,
          fullName: user.val().fullName,
          email: user.val().email,
          roles: user.val().roles,
          addedOn: user.val().addedOn
        });
        return false;
      })
      console.log(users);
      this.usersList = users;
      this.loadedUsersList = users;
    });

    const self = this;

    firebase.database().ref('onlineOrdering/globalOrdering').on('value', function(snapshot) {
      self.ekitchen.globalOrdering = snapshot.val();
    });

    firebase.database().ref('onlineOrdering/globalOrderingReason').on('value', function(snapshot) {
      self.ekitchen.globalOrderingReason = snapshot.val();
    });
  }

  ngOnInit() {
  }

  addUser(user) {
    // setting role
    this.newUser.roles.administrator = true;
    this.afAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password).then((addedUser) => {
      console.log(addedUser);
      this.afDb.object('users/' + addedUser.uid).set({
        userId: addedUser.uid,
        fullName: this.newUser.fullName,
        email: this.newUser.email,
        roles: this.newUser.roles,
        addedOn: new Date().toISOString()
      }).then((res) => {
        console.log('added successfully');
        this.toaster.addToastSuccess('Added User Successfully', '');
        user.resetForm();
        this.router.navigate(['/login']);
      }).catch(err => {
        this.toaster.addToastError('Error', err.message);
        // this.errorMessage = err.message;
      })
    }).catch(err => {
      this.toaster.addToastError('Error', err.message);
      // this.errorMessage = err.message;
    })
  }

  configInput() {
    if (this.ekitchen.globalOrdering === true) {
      this.ekitchen.globalOrderingReason = '';
    }
  }

  submitOrdering() {
    if (this.ekitchen.globalOrdering === false) {
      if (this.ekitchen.globalOrderingReason !== '') {
        // tslint:disable-next-line:max-line-length
        firebase.database().ref('onlineOrdering').set({'globalOrdering': this.ekitchen.globalOrdering, 'globalOrderingReason': this.ekitchen.globalOrderingReason});
        this.toaster.addToastSuccess('Online Ordering Status Changed', '');
      } else {
        this.toaster.addToastError('Please specify a reason', '');
      }
    } else {
      // tslint:disable-next-line:max-line-length
      firebase.database().ref('onlineOrdering').set({'globalOrdering': this.ekitchen.globalOrdering, 'globalOrderingReason': this.ekitchen.globalOrderingReason});
      this.toaster.addToastSuccess('Online Ordering Status Changed', '');
    }

  }

}
