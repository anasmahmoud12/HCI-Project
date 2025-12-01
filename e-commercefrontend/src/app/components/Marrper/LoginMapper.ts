import { Login } from './../models/login';
import { Injectable } from "@angular/core";


@Injectable({
providedIn:'root'

})
export class LoginMapper{
    makeLongin(email:string,password:string):Login{
        return{
            email:email,
            password:password
        };
    }
}