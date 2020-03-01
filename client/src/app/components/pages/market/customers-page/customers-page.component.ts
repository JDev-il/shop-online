import { Component, OnInit, ElementRef, Renderer2} from '@angular/core';
import { MarketApiService } from '../../../../services/marketServices/market-api.service'
import { ApiService } from '../../../../services/api.service'
import { ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
// import { Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customers-page',
  templateUrl: './customers-page.component.html',
  styleUrls: ['./customers-page.component.css']
})
export class CustomersPageComponent implements OnInit {

    /* #fileInput Img Value */
    @ViewChild('quantity', {static: true}) quantity: ElementRef;
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

    constructor(private _api:ApiService, private _market:MarketApiService, 
      private formBuilder:FormBuilder, private _http:HttpClient, 
      private router:Router, private renderer: Renderer2) {

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
        }
      })  
    
    }

  
    /* Customer Page GLOBAL Variables
    -------------------------------------------------- */
  
    mySubscription: any;
    count = 0
    /* Array & Objects */
    searchInputArr = []
    quantityArr = []
    preSort = []
    sortedArr = []
    productsInCartsArr: any
    addedProducts: any;

    totalPriceArr = []
    priceTimesQuantity = []
    quantityBasedArray = []

    itemsInCartDetails = []
    matchingProductsToItems: Array<any> = []

    
    productId: ""
    productName: ""
    productImg: String
    totalPrice: any
    /* Cart Item Edit */
    itemId = ""
    itemQuantity: any
    /* Cart Item Edit */

    categories: any
    marketProducts: any;
    marketProductFiltered: Array<any> = []
  
    arrToggle: Array<any> = []
    cartShow: any
    emptyCart: boolean = false
    tableLoader: boolean = false
    allowAddToCart: boolean = true
    diableFirstButton: boolean = false
    addToCartApproval: boolean;
    /* Array & Objects */
  
    /* Boolean Variables */
    reminder: boolean = true
  
    productsInHtml: boolean;
    noProducts: boolean = true
    filteredProducts: boolean = false
    hideCategory: boolean = false

    access: boolean = false
    continueShopping: boolean = false
    loader: boolean = false
    firstPurchase: boolean = false
    returningCustomer: boolean;
    startOver: boolean = false

    numberErrorHide: boolean = false
    navigateToOrders: boolean;
    /* Boolean Variables */
  
  
    /* String Variables */
    firstname: String
    firstTimeHere: String = "Welcome to your first purchase!"
    regularCustomer: String;
    dataDismiss: String = "modal"
    quantityStatus: String;
    numberError: String;
    numberErrorMsg: String;
    classNameActive: String = ""
    startContinueButton = "Start Shopping Now!"

    /* String Variables */
  
  
    /* Misc. Variables */
    selectedFile: File = null;
    filename: String = null
    path: String = null
    imageValue: String;
    currentQuantity: Number;
    /* Misc. Variables */
  
  
    /* Product URL */
    url: String
    /* Product URL */
  
  
    /* End of Customer Page GLOBAL Variables
    -------------------------------------------------- */

    startShopping(){
      this.loader = true
      this.continueShopping = true
      setTimeout(() => {
        this.allowAddToCart = false
        this.access = true
        this.loader = false
      }, 1500);
    }

    searchProduct(value: any){
        if(value.search == ""){
          this.searchInputArr = []
          this.marketProductFiltered = []
          this.filteredProducts = false
          return false
        } else {
          var v = value.search
          this.searchInputArr.push(v)
            let val = this.searchInputArr[this.searchInputArr.length -1]
            this._market.getSearchedProduct(val).subscribe(res=>{
            if(this.searchInputArr.length >= 1){
                  this.marketProductFiltered = res[0]
                  this.filteredProducts = true            
              }
           })
        }          
      }


    showProductsInCategory(id: any){
      this.marketProductFiltered = []
      this.marketProducts.forEach(prod => {
        if(id == prod.category_id){
          this.filteredProducts = true          
          this.marketProductFiltered.push(prod)        
        } else {
          this.hideCategory = true
        }
      });
    }

    clearCategorySelection(){
      this.filteredProducts = false
    }
  
  
    allValues(value: any){
      if(value.productName && value.productPrice && value.category){      
          this.reminder = false
      } else {
        this.reminder = true
      }
    }
  

    /* End of Form 1 Actions & Functions
    -------------------------------------------------- */



    /*=============================================
    =            Items/Cart Section               =
    =============================================*/
    modalToArr(id: any){
      this.productId = id
      this.addToCartApproval = false
      this.quantityStatus = "Choose quantity:"
      this.marketProducts.forEach(prod => {
        if(id == prod._id){
        this.productName = prod.productName
        this.productImg = prod.product_img      
        if(this.itemsInCartDetails == [] || this.itemsInCartDetails == undefined){
        } else {
          this.itemsInCartDetails.map(e=>{
            if(e.product_id == prod._id){
              this.quantityStatus = "Item already in cart!"
              this.addToCartApproval = true
            }
          })
        }           
        }
      })
    }

    quantitySelect(value: number, invalid: any){
      if(value <= 0 || value == null){        
        this.numberError = '1px solid red'
        this.numberErrorMsg = "Please choose a valid quantity!"
        this.numberErrorHide = true
        setTimeout(() => {
          this.numberErrorMsg = ""
          this.numberErrorHide = false     
        }, 2500);
        return false
      } else {
        this.numberError = ''
        this.marketProducts.forEach(prod => {
          if(this.productId == prod._id){
            this.quantityArr.push(value)
          }
        })
      }
    }


    addToCart(){
      if(this.quantityArr[this.quantityArr.length - 1] == undefined || this.quantityArr[this.quantityArr.length - 1] <= 0){
        this.numberErrorMsg = "Please choose a valid quantity!"
        this.numberErrorHide = true
        setTimeout(() => {
          this.numberErrorMsg = ""
          this.numberErrorHide = false     
        }, 2500);
        return false
      } else {
        this.marketProducts.map(p=>{
          if(this.productId == p._id){            
            this.productsInCartsArr = [p, this.quantityArr[this.quantityArr.length - 1]];
            this._market.addProductToCart(this.productsInCartsArr).subscribe(items =>{
                this._market.getSingleCart().subscribe(cartDetails=>{
                  this.priceTimesQuantity = []
                  Promise.all(this.itemsInCartDetails = cartDetails[0]).then(()=>{
                    for (let i = 0; i < this.itemsInCartDetails.length; i++) {
                      this.priceTimesQuantity.push(this.itemsInCartDetails[i].price * this.itemsInCartDetails[i].quantity)                       
                    }
                    this.totalPrice = this.priceTimesQuantity.reduce((result, item)=>{
                      return result + item;
                    }, 0);
                    this.tableLoader = true
                    this.emptyCart = false
                    setTimeout(() => {
                      this.tableLoader = false
                    }, 1500);                    
                  })
                })                    
            })
          }  
        })    
        this.quantityArr = []
        this.quantity.nativeElement.value = ""
      }
    }


    editItemInCart(item: any){
        this.itemsInCartDetails.map(items=>{
          if(items.itemId == item.itemId){
            this.itemId = item.itemId
          }
        })
    }

  

    itemQuantityEdit(quantity: any){
      if(quantity <= 0 || quantity == null){        
        this.numberError = '1px solid red'
        this.itemQuantity = null;
        return false
      } else {
        if(quantity > 0){
          this.numberError = ''
          this.itemQuantity = quantity
        }
      }
    }

    updateQuantity(item: any){
      if(this.itemQuantity == null || this.itemQuantity == ""){
        return false        
      } else {
        this._market.editItem([item, this.itemQuantity, this.itemsInCartDetails]).subscribe(updated=>{                          
          this.priceTimesQuantity = []
          this.itemsInCartDetails = updated[0]
            this.itemId = ''
            for (let i = 0; i < this.itemsInCartDetails.length; i++) {
              this.priceTimesQuantity.push(this.itemsInCartDetails[i].price * this.itemsInCartDetails[i].quantity)                       
            }  
            this.tableLoader = true
            setTimeout(() => {
              this.tableLoader = false
              this.totalPrice = this.priceTimesQuantity.reduce((result,item)=>{
                return result + item;
              }, 0);
            }, 1500);
        })
       
      }      
    }


    removeItemFromCart(item: any){      
      this.itemQuantity = item.quantity
      if(this.itemQuantity == null || this.itemQuantity == ""){
        return false        
      }
      this._market.removeItem(item).subscribe(removed=>{        
        this.itemsInCartDetails = removed[0]        
        if(this.itemsInCartDetails == undefined){
          this.totalPrice = 0
          setTimeout(() => {
            setTimeout(() => {
              this.tableLoader = false
              this.emptyCart = true          
            }, 1500);
            // this.quantityBasedArray = removed[0]
          }, 200);
          return false
        } else {
          this.priceTimesQuantity = []
          for (let i = 0; i < this.itemsInCartDetails.length; i++) {
            this.priceTimesQuantity.push(this.itemsInCartDetails[i].price * this.itemsInCartDetails[i].quantity)
          }          
          console.log(this.priceTimesQuantity);
          
          this.tableLoader = true
          setTimeout(() => {
            this.tableLoader = false
            this.totalPrice = this.priceTimesQuantity.reduce((result,item)=>{
              return result + item;
            }, 0);
          }, 1500);

        }
      })
    }


    cancelEdit(){
      this.itemId = ''
    }


    clearCart(){    
      if(this.itemsInCartDetails.length == 0){
        return false        
      } else {
        let cartId = this.itemsInCartDetails[0].cart_id
        this._market.clearCart(cartId).subscribe(data=>{          
          this.tableLoader = true
          setTimeout(() => {
            setTimeout(() => {
              this.tableLoader = false
              this.emptyCart = true          
            }, 1500);
            this.itemsInCartDetails = data[0]         
          }, 200);          
        })
      }
    }


    toCheckOut(){
      this._market.getSingleCart().subscribe(singleCart=>{
        Promise.all(this.itemsInCartDetails = singleCart[0])
        .then(()=>{
          if(this.itemsInCartDetails.length >= 1){
            this.navigateToOrders = true
            setTimeout(() => {
            this.router.navigate(['/market/order'])     
            this.navigateToOrders = false
          }, 2500);
        } else {
          return false
        }
        })
      })


    }

  /*============  End of Items/Cart Section  =============*/




    closeModal(){
      this.quantity.nativeElement.value = ""
    }
  
    ngOnInit() {    
      this._api.postVerifyCustomer().subscribe(details=>{
        if(details[0] == false){
          this.router.navigate(['/'])
       } else {
          this.firstname = details[1];
          this._market.getAllProducts().subscribe(data=>{
            this.marketProducts = data[0]
            if(this.marketProducts == [] || this.marketProducts == ""){
              this.productsInHtml = true;
              this.noProducts = false;
              this.diableFirstButton = true
            } else {
            /* GET Existed / CREATE New Cart */
              this._market.createCart().subscribe(cartDetails=>{
                this._market.filteredCategories().subscribe(data=>{ 
                 if(cartDetails[0] == true){
                    this.priceTimesQuantity = []
                    this.emptyCart = true
                    this.categories = data
                    this.firstPurchase = true
                    setTimeout(() => {
                      this.firstPurchase = false
                    }, 5000);   
                  } else {
                    this._market.getSingleCart().subscribe(singleCart=>{
                      this.categories = data
                      this.priceTimesQuantity = []
                      Promise.all(this.itemsInCartDetails = singleCart[0]         
                        ).then(()=>{
                          if(this.itemsInCartDetails.length > 0){
                            this.emptyCart = false
                            this.regularCustomer = `${details[1]}, your cart is waiting for you!`
                            this.startContinueButton = "Show Cart"
                          } else {
                            this.emptyCart = true
                            this.startContinueButton = "Start Shopping Now!"
                          }                               
                        }).then(()=>{
                          for (let i = 0; i < this.itemsInCartDetails.length; i++) {
                            this.priceTimesQuantity.push(this.itemsInCartDetails[i].price * this.itemsInCartDetails[i].quantity)                       
                          }
                          this.totalPrice = this.priceTimesQuantity.reduce((result,item)=>{
                            return result + item;
                          }, 0);
                        }).catch(err=>{
                          if (err) throw err
                        })
                      })
                    }
                  })
                })
              /* GET Existed / CREATE New Cart -- End Of Section */
              this.productsInHtml = false;
              this.noProducts = true;
            }
          })
        }
      })
    }

}


