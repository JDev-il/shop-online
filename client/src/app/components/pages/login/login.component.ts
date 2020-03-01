import { Component, OnInit, Injectable, EventEmitter, Output, ElementRef, Directive, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MarketApiService } from 'src/app/services/marketServices/market-api.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  // @ViewChild('carousel', { static: true }) aboutCustomerPage: ElementRef;

  /* Login Component GLOBAL Variables
  -------------------------------------------------- */
  cities: any
  productsCounter: any;
  productsArr = []
  ordersCounter: any
  ordersArr = []
  /* Boolean Variables */
  err: any;
  showHideSignUp: boolean = true;
  counter: any
  determine: boolean = false
  adminBtn: boolean = false
  loginBtnLoader: boolean = false
  approvedData: boolean = false

  /* Boolean Variables */

  /* String Variables */
  logErr: String = "Incorrect email and/or password! Please try again"
  route: ActivatedRoute;
  carousel: String  
  loginBtn: String = "Enter Email & Password To Login"
  adminBtnStyle: String = 'rgba(255, 206, 9, 0.838)'; 
  /* String Variables */

  /* End of Login Component GLOBAL Variables
  -------------------------------------------------- */

  constructor(private _api:ApiService, private _market:MarketApiService, private fb: FormBuilder, private router: Router, public aboutCustomerPage: ElementRef) { 
    this.carousel = "carousel"
  }

  onSubmit(value: any) {
    var loginDetails = value
    this._api.loginCustomer(loginDetails).subscribe((data)=>{
      if(data == false){
        this.err = true
      } else {
        localStorage.setItem("userKey", data.token)
        if(data.customer == false){
          this.router.navigate(['/login/process'])     
        } else {
          if(data.customer == true){
            this.router.navigate(['/login/process'], { relativeTo: this.route });
          }
        }
      }
    })    
  }





  determineCusOrAd(value: any){
    if(value.email == undefined || value.email == "" && value.password == undefined || value.password == "" ){
      this.loginBtn = "Enter Email & Password To Login"
      this.adminBtnStyle = 'rgba(255, 206, 9, 0.838)'
      this.loginBtnLoader = false
    } else {
      if(value.password != undefined){
        if(value.email.includes("@") && value.password){
          this.loginBtn = "Checking..."            
          this.determine = false
          this.loginBtnLoader = true   
          this.adminBtnStyle = 'rgba(255, 206, 9, 0.838)'
          setTimeout(() => {
            this.loginBtn = "Invalid Email or Password.."
            this.adminBtnStyle = 'rgba(242, 88, 88, 0.838)'
            this.loginBtnLoader = false
            this._api.loginTypeCheck(value).subscribe(data=>{
              if(data[0] != false && data[0] != undefined){
                this.loginBtn = "Verifing..."
                this.loginBtnLoader = true
                this.adminBtnStyle = 'rgba(131, 246, 142, 0.838)'
                if(data[0] !== true){
                 setTimeout(() => {
                   this.loginBtn = "Welcome " + data[0]
                   this.adminBtnStyle = 'rgba(23, 163, 184, 0.269)'
                   this.loginBtnLoader = false
                   this.err = false           
                   this.determine = true
                 }, 1800);            
               } else {
                 setTimeout(() => {
                /*
                 ADD "IF CART EXIST - CONTINUE SHOPPING ; ELSE START SHOPPING 
                 / OR TWO BUTTONS --> "START OVER" (DELETE CART) & "CONTINUE SHOPPING" 
                */
                  this.loginBtn = 'Login'
                  this.adminBtnStyle = 'rgba(255, 206, 9, 0.838)'
                  this.loginBtnLoader = false
                  this.err = false           
                  this.determine = true
                 }, 1800);            
               }
              }
             })            
          }, 500);
        } else {
          this.loginBtn = "Enter Email & Password To Login"
          this.loginBtnLoader = false
        }
      } else {
        return false
      }
    }
  }

  valueCheck(value: any){  
  this.showHideSignUp = false
  this.err = false 
  }

  
  orderCounter(){
    const interval = setInterval(()=>{
      this.ordersCounter ++ 
      if(this.ordersCounter == this.ordersArr){
        clearInterval(interval)
      }
    }, 100)    
  }

  productCounter(){
    const interval = setInterval(()=>{     
      this.productsCounter ++ 
      if(this.productsCounter == this.productsArr){
        clearInterval(interval)
      }
    }, 100)    
  }

  
  ngOnInit() {   
    this.counter = 0
    this.productsCounter = 0
    this.ordersCounter = 0
    this._market.getAllProducts().subscribe(products=>{
      this._market.getAllOrders().subscribe(orders=>{
       if(products[0] == ''){
       return false
      } else {
          this.productsArr = products[0].length;
          this.productCounter() 
      }
      if(orders[0] == ''){        
      return false
      } else {
        this.ordersArr = orders[0].length
        this.orderCounter()
      }
    })
  })
    if(localStorage.getItem('userKey')){
      this._api.postVerifyCustomer().subscribe(details => {
        if(details[0] == false){
          this.router.navigate(['/market/admin'])
        } 
          if(details[0] == true){
            this.router.navigate(['/market/customer'])
        }
      })  
    }
  }

}
