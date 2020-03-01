import { Component, OnInit, ElementRef, AfterViewInit, Renderer2, Pipe, PipeTransform} from '@angular/core';
import { MarketApiService } from '../../../../services/marketServices/market-api.service'
import { ApiService } from '../../../../services/api.service'
import { ViewChild } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})

@Pipe({
  name: 'highlight'
})


export class OrdersPageComponent implements OnInit {

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @ViewChild('tableRow', {static: true}) tableRow:ElementRef;
  @ViewChild('myModal', {static: true}) myModal: ElementRef;
  @ViewChild('bodyImage', {static: true}) body: ElementRef


    bootstrap: any = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css">
    <link rel="stylesheet" href="assets/forms.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.15.0/umd/popper.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>`
  
  
    /* Customer Page GLOBAL Variables
    -------------------------------------------------- */
    count = 0
    
    /* Array & Objects */
    searchInputArr = [];
    filteredItemsArr: Array<any>[];
    cities: any
    itemsInCartDetails: Array<any> = []
    totalAmount: Array<any> = []
    orderProduct: Array<Object> = []
    clickingArr: Array<any> = []
    doubleClickData: Array<any> = []
    valuesArr: any
    btn: any
    input: Array<any> = []
    tableRowArr: Array<any> = []
    clearMark: any
    styleCheck: any
    /* Array & Objects */
  
  
    /* Boolean Variables */
    diableFirstButton: boolean = false  
    showPayNowForm: boolean = true
    orderLoader: boolean = false
    isDoubleClicked: boolean;
    doubleClickNotification: boolean;
    continueButton: boolean = false
    showCreditCard: boolean = true
    choseVisaCard: boolean = false
    choseMasterCard: boolean = false
    showCard: boolean = true
    placeOrderBtn: boolean = true
    filteredItems: boolean;
    markUpName: boolean = false
    orderConfirmed: boolean;
    showDateAlert: boolean;
    /* Boolean Variables */
  
  
    /* String Variables */
    classNameActive: String;
    firstname: ""; lastname: "" ; city: ""; street: ""; date: any;
    inputEventTarget: String
    modalExp: String = ''
    orderProcess: String = "Place Order"
    /* String Variables */
  
  
    /* Misc. Variables */
    finalPrice: any
    fromNowOn: any
    timer: any
    delay: Number
    creditValue: Object
    /* Misc. Variables */
  
  
    /* Product URL */
     /* Product URL */
  
  
    /* End of Customer Page GLOBAL Variables
    -------------------------------------------------- */
  
  constructor(private _api:ApiService, private _market:MarketApiService, private formBuilder:FormBuilder, private _http:HttpClient, private router:Router, private renderer: Renderer2, private el: ElementRef) {
    this.renderer.listen('window', 'click',(e:Event)=>{      
      if(e.target == this.searchInput.nativeElement){
       if(this.diableFirstButton == true){
         this.classNameActive = ""       
       } else {
         this.classNameActive = "active"
         this.searchInput.nativeElement.value = ""            
       }
     } else {
      this.classNameActive = ""
      this.searchInput.nativeElement.value = ""
      if(this.clearMark != undefined){
        this.renderer.setStyle(this.clearMark, 'background', '')
      } else {
        this.searchInput.nativeElement.value = ""
      }
      }
      
   }) 
  }



    /*=============================================
    =                   BTNs Sectsion              =
    =============================================*/
    
    goBack(){
      this.router.navigate(["/market/customer"])
    }

    payNow(){
      this.orderLoader = true
      setTimeout(() => {
        this.orderLoader = false
        if(this.showPayNowForm == true){
          this.doubleClickNotification = true
          setTimeout(() => {
            this.doubleClickNotification = false
          }, 1500);
        } else {
          return false
        }
        this.showPayNowForm = false
      }, 800);            
    }    


    btnFunc(){
      var allBtns = this.el.nativeElement.querySelectorAll("button")
      for (let i = 0; i < allBtns.length; i++) {
        if(allBtns[i].classList.contains('paymentBtn')){
           this.btn = allBtns[i]
      }}}

      inputFunc(){
        var inputs = this.el.nativeElement.querySelectorAll('input')
        for (let i = 0; i < inputs.length; i++) {
          if(inputs[i].classList.contains('CCPay')){
            if(this.input.length > 1){
              return false
            } else {
              this.input.push(inputs[i])              
            }
        }}}
       
      visaType(){
        this.input[0].classList.remove('ng-valid')
        this.input[0].classList.add('ng-invalid')
        this.input[0].value = ""
      }

      masterType(){
        this.input[1].classList.remove('ng-valid')
        this.input[1].classList.add('ng-invalid')
        this.input[1].value = ""
      }

    orderFormClick(arr: any){
      this.clickingArr.push(arr[1])
      this.btnFunc()
      if(this.clickingArr.length > 1){
        this._api.userDetailsOrderPage().subscribe(userData=>{
          this.btn.classList.remove('btn-outline-danger')
          this.btn.classList.add('btn-outline-success')
          this.city = userData[0].city
          this.street = userData[0].street
          this.date = this.fromNowOn
          this._market.checkShipping(this.date).subscribe(response=>{
            if(response[0] == true){
              this.continueButton = true
              this.showDateAlert = false
            } else {
              this.btn.classList.remove('btn-outline-success')
              this.btn.classList.add('btn-outline-danger')
              this.continueButton = false
              this.showDateAlert = true
              this.styleCheck = { "border-left": "3px solid #a94442",
              "border-right": "3px solid #a94442" }
            }
          })        
          setTimeout(() => {
            this.doubleClickNotification = true              
          }, 200);
          this.clickingArr = []
        })        
      } else {
        setTimeout(() => {
          this.clickingArr = []
        }, 200);
      }
    }


    orderDetailsForm(value: any){
      this.btnFunc()
      if(value.city && value.street && value.date !== undefined){
      this.btn.classList.remove('btn-outline-danger')
      this.btn.classList.add('btn-outline-success')
      this.city = value.city
      this.street = value.street
      this.date = value.date
      this._market.checkShipping(this.date).subscribe(response=>{
        if(response[0] == true){
          this.continueButton = true
          this.showDateAlert = false
        } else {
          this.btn.classList.remove('btn-outline-success')
          this.btn.classList.add('btn-outline-danger')
          this.continueButton = false
          this.showDateAlert = true
          this.styleCheck = { "border-left": "3px solid #a94442",
          "border-right": "3px solid #a94442" }
        }
      })
      } else {
        this.btn.classList.remove('btn-outline-success')
        this.btn.classList.add('btn-outline-danger')
        this.continueButton = false
        this.showCreditCard = true
        this.choseVisaCard = false
        this.choseMasterCard = false
        this.showCard = true  
        this.inputFunc()
        this.visaType()
        this.masterType()
      }
    }

    
    continueToPayment(value: any){
      if(!value.city || !value.street || !value.date){
        this.showCreditCard = true
      } else {
        this.showCreditCard = false
      }
    }

    visa(){
      this.inputFunc()
      this.placeOrderBtn = true
      this.choseVisaCard = true
      this.choseMasterCard = false
      this.showCard = false
      this.masterType()
    }
    masterCard(){
      this.inputFunc()
      this.placeOrderBtn = true
      this.choseMasterCard = true
      this.choseVisaCard = false
      this.showCard = false
      this.visaType()
    }

    checkCreditCard(){
      this.inputFunc()
      let visaCard = this.input[0].value
      let masterCard = this.input[1].value
          if(visaCard.length == 16 || masterCard.length == 16){
            if(visaCard !== undefined && visaCard[0] == "4"){
              this.creditValue = {'visa': visaCard.match(/\d{4}(?=\d{2,3})|\d+/g).join('-')}
              this.placeOrderBtn = false
            }
            if(masterCard !== undefined && masterCard[0] == "5"){
              this.creditValue = {'mastercard': masterCard.match(/\d{4}(?=\d{2,3})|\d+/g).join('-')}
              this.placeOrderBtn = false           
            }            
          } else {
            this.placeOrderBtn = true           
            return false
          }
    }


    placeOrder(){  
      const orderDetails = {
        total_price: this.finalPrice,
        city: this.city,
        street: this.street,
        shipping_date: this.date,
        cd_4_last_digits: this.creditValue
      }
        this._market.placeOrder(orderDetails).subscribe(res=>{
        this.orderProcess = "Processing.."
            setTimeout(() => {
              if(res[0] == true){
                this.orderConfirmed = true
                this.orderProcess = "Order Confirmed!"
                } else {
                this.orderConfirmed = false
                this.orderProcess = "Order Error"
              }            
            }, 4000);
      })
    }
  
 

    downloadReceipt(){
      var items = document.getElementById('itemsTable').innerHTML
      let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          ${this.bootstrap}
          <title>JDCommerce</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">
    <h3 class="text-center">JDCommerce Invoice</h3>
    <h5 class="text-center">${this.firstname} ${this.lastname}</h5>
    <br/>
    <h5>Purchased Items:</h5>
    <div class="mx-auto">${items}</div>
    <br/>
    <h5>Shipping Details:</h5>
      <form>
        <div class="form-group">
          <p>City: ${this.city}</p>
        </div>
        <div class="form-group">
          <p>Street Address: ${this.street}</p>
        </div>
        <div class="form-group">
          <p>Shipping Date: ${this.date}</p>
        </div>
        <hr />
      </form>
      <br/>
      <h4 class="text-center">Hope to see you again soon!</h4>
    </body>
  </html>`
      

    );
    popupWin.document.close();
    }
    



    backToStore(){
      let cartId = this.itemsInCartDetails[0].cart_id
      this._market.clearCart(cartId).subscribe(data=>{        
        this.router.navigate(['/market/customer'])               
      })

    }



    searchItems(value: any){      
      if(value.search == ""){
        this.searchInputArr = []
        this.filteredItemsArr = []
        this.filteredItems = false
        return false
      } else {
        var v = value.search
          this.searchInputArr.push(v)
          let val = this.searchInputArr[this.searchInputArr.length -1]
          this._market.getSearchedItems(val).subscribe(res=>{  
            for (let i = 0; i < this.itemsInCartDetails.length; i++) {
              let textReady = this.tableRow.nativeElement.children[i].querySelector('span');
              if(this.itemsInCartDetails[i].productName == res[0].productName){
                this.clearMark = textReady
                if(v.length > 1){
                  this.renderer.setStyle(textReady, 'background', 'yellow')
                } else{
                  if(v.length == 1){
                    this.renderer.setStyle(textReady, 'background', '')
                  }
                }
              } else {
                this.renderer.setStyle(textReady, 'background', '')
              }
            }
         })
        } 
    }


    /*============  End of BTNs Section  =============*/


    currentDate(){
      let date = new Date().toJSON().split('T')[0];
      this.fromNowOn = date
    }


  ngOnInit() {
    this._api.postVerifyCustomer().subscribe(details=>{
      if(details[0] == false){        
        this.router.navigate(['/'])    
      } else {
        this.currentDate()
        this._api.getIsraelCities().subscribe(cities=>{
          this.cities = cities
       })   
        this._api.userDetailsOrderPage().subscribe(data=>{
          this.firstname = data[0].firstname; this.lastname = data[0].lastname; 
        })
        this._market.getSingleCart().subscribe(singleCart=>{                   
          this.itemsInCartDetails = singleCart[0]
            console.log(this.itemsInCartDetails);
             for (let i = 0; i < this.itemsInCartDetails.length; i++) {
               this.totalAmount.push(this.itemsInCartDetails[i].price * this.itemsInCartDetails[i].quantity)                       
             }            
            this.finalPrice = this.totalAmount.reduce((result,item)=>{
              return result + item;
            }, 0);      
           })
      }
    })

  }

}
