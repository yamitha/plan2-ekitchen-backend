import { User } from './../_models/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

    user: User;

    constructor() { }

    getUser() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        return this.user;
    }

}
