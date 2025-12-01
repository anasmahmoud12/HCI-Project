import { Injectable } from "@angular/core";
import { Sighup } from "../models/sighup";

@Injectable({
    providedIn:'root'
})
export class SighupMapper{

makeSighup(firstName:string,lastName:string,email:string,password:string):Sighup{
return{
    firstName:firstName,
    lastName:lastName,
    email:email,
    password:password
};


}

}