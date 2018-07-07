import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: Observable<firebase.User>;
  model: any = {};
  loading = false;
  error = '';

  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private router: Router
  ) {
    this.user = afAuth.authState;
  }

  ngOnInit() {
    // reset login status
    this.afAuth.auth.signOut();
  }

  login() {
    this.loading = true;
    this.afAuth.auth.signInWithEmailAndPassword(this.model.email, this.model.password).then(value => {
      this.loading = false;

      const userObj = this.afDatabase.object('users/' + value.uid);

      userObj.subscribe((res) => {
        localStorage.setItem('currentUser', JSON.stringify({ fullName: res.fullName, email: res.email, roles: res.roles}));
        this.router.navigate(['/home']);
      });

    })
    .catch(err => {
      this.loading = false;
      this.error = err.message;
    });
  }


}
