import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

 import 'rxjs/add/operator/map';
 import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private af: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.af.authState.mergeMap(user => {
          if (user) {
            return this.db.list('users', {
              query: {
                orderByKey: true,
                equalTo: user.uid
              }
            });
          } else {
            return Observable.of({});
          }
        })
        .map(user => {
          if (!(user && (Object.keys(user).length === 0))) {
            if (user[0].roles.administrator === true) {
              return true;
            } else {
              this.router.navigate(['/login']);
            }
          } else {
            this.router.navigate(['/login']);
          }
        });
      }
}
