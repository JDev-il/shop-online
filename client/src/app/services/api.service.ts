import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  post(arg0: string, arg1: {}) {
    throw new Error("Method not implemented.");
  }


  API_KEY = 'JD_COMMERCE_2019';
  constructor(private _api: HttpClient) { 
  }


  headers(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
    return headers
  }
  
  tokenHeaders(){
    let token = localStorage.getItem("userKey")
    const headers = new HttpHeaders().set('Authorization', token);
    return headers
  }

  
  public getIsraelCities(){
    return this._api.get("https://raw.githubusercontent.com/Arturiko/israel-cities/master/JsonProperties.json")
  }

  public postNewCustomer(details: any):Observable<any>{
    return this._api.post("http://localhost:3000/users/add", details, {headers: this.headers()});
  }

  public postCheckCustomer(data: any):Observable<any>{
    return this._api.post("http://localhost:3000/users/cuscheck", data, {headers: this.headers(), responseType: 'text'});
  }

  public loginCustomer(loginDetails: any):Observable<any>{
    return this._api.post("http://localhost:3000/users/login", loginDetails, {headers: this.headers()});
  }
  
  public loginTypeCheck(loginDetails: any):Observable<any>{
    return this._api.post("http://localhost:3000/users/prelogin", loginDetails, {headers: this.headers()});
  }

  public postVerifyCustomer(){
    return this._api.post("http://localhost:3000/users/verify", {}, {headers: this.tokenHeaders()});
  }

  public userDetailsOrderPage(){
    return this._api.post("http://localhost:3000/users/order",{}, {headers: this.tokenHeaders()})
  }

}
