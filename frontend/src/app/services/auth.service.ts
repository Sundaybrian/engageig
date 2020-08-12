import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http
import { User } from "../models/User";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: User;
  baseUrl:string = 'https://europe-west3-engageig-4f957.cloudfunctions.net/api/'

  constructor(private http:HttpClient) {

  }

  login(email, password) {
    return this.http.post(`${this.baseUrl}login`,{email, password});
  }


  // register(email, password) {
  //   //
  //   return this.http.post(`${this.baseUrl}login`,{email, password});
  // }

  logout() {}

  getAuthenticatedUser() {}

  afterSignIn(user) {
this.user  = user;
if(user['isAdmin'] == true){

}
  }
}
