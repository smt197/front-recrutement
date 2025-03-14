import { EventEmitter } from '@angular/core';
import { User } from '../interfaces/User';


export class Auth {
    public static isLoggedIn = new EventEmitter<boolean>();
    static userEmitter = new EventEmitter<User>();

    public static user: User | null = null;
    public static loginStatus: boolean = false;

}