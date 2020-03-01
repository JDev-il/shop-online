import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MarketApiService {

  constructor(private _marketApi:HttpClient) { }

  
  /* Admin Page Data Api's
-------------------------------------------------- */


headers(){
  let token = localStorage.getItem("userKey")
  const headers = new HttpHeaders().set('Authorization', token)
  return headers
}


public getAllProducts(){
  return this._marketApi.get("http://localhost:3000/products")
}

public getSearchedProduct(searchData: any){
  return this._marketApi.post("http://localhost:3000/products/search", {searchData})
}

public getCategories(){
  return this._marketApi.get("http://localhost:3000/products/categories")
}

public filteredCategories(){
  return this._marketApi.get("http://localhost:3000/products/filcat")
}

public adminAddProduct(product: Object){
  return this._marketApi.post("http://localhost:3000/products/add", product, {headers: this.headers()})
}

public adminEditProduct(editDetails: Object){
  return this._marketApi.put("http://localhost:3000/products/edit", editDetails, {headers: this.headers()})
}

/* End of Admin Page Data Api's
-------------------------------------------------- */




  /* Customer Page Data Api's
-------------------------------------------------- */


public checkForCartBeforeLogin(details: any):Observable<any>{
  return this._marketApi.post("http://localhost:3000/logincart", {details})
}

public createCart():Observable<any>{
  return this._marketApi.get("http://localhost:3000/cart/new", {headers: this.headers()})
}

public getSingleCart(){
  return this._marketApi.get("http://localhost:3000/cart/single", {headers: this.headers()})
  }

public addProductToCart(itemsInCart: Array<any>):Observable<any>{
  return this._marketApi.post("http://localhost:3000/items/addtocart", itemsInCart, {headers: this.headers()})
}

public clearCart(clearItems: any):Observable<any>{
  return this._marketApi.delete('http://localhost:3000/cart/clear/' + `${clearItems}`, {headers: this.headers()})
}

public editItem(updateItem: Array<any>){
  return this._marketApi.post("http://localhost:3000/items/edit", updateItem, {headers: this.headers()})
}

public removeItem(removeItem: any){
  return this._marketApi.post("http://localhost:3000/items/remove", removeItem, {headers: this.headers()})
}

public getSearchedItems(searchItems: any){
  return this._marketApi.post("http://localhost:3000/items/search", {searchItems}, {headers: this.headers()})
}


/* End of Customer Page Data Api's
-------------------------------------------------- */




/* Orders Page Data Api's
-------------------------------------------------- */

public getAllOrders(){
  return this._marketApi.get("http://localhost:3000/orders")
}

public checkShipping(shippingDate: any){
  return this._marketApi.post("http://localhost:3000/orders/shipping", {shippingDate})
}

public placeOrder(orderDetails: any){
  return this._marketApi.post("http://localhost:3000/orders/placeorder", {orderDetails}, {headers: this.headers()})
}

/* End of Orders Page Data Api's
-------------------------------------------------- */



}
