import { Component, OnInit, ElementRef, AfterViewInit } from "@angular/core";
import { MarketApiService } from "../../../../services/marketServices/market-api.service";
import { ApiService } from "../../../../services/api.service";
import { ViewChild } from "@angular/core";

import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Validators } from "@angular/forms";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.css"]
})
export class AdminPageComponent implements OnInit {
  /* #fileInput Img Value */
  @ViewChild("fileInput", { static: true }) fileInput: ElementRef;
  /* #addProductForm Form Value */
  @ViewChild("addProductForm", { static: true }) addProductForm: ElementRef;

  constructor(
    private _api: ApiService,
    private _market: MarketApiService,
    private formBuilder: FormBuilder,
    private _http: HttpClient,
    private router: Router
  ) {}

  /* Admin Page GLOBAL Variables
  -------------------------------------------------- */

  mySubscription: any;

  /* Array & Objects */
  searchInputArr = [];
  categories: any;
  marketProducts: any;

  arrToggle: Array<any> = [];
  
  /* Product Section */
  productShow: any;

  defaultProductValues: any
  /* Array & Objects */

  /* Boolean Variables */
  hideProductDetails: boolean;
  hideProductForm: boolean = true;
  disableEnableBtn: boolean;
  uploadButton: boolean;
  reminder: boolean = true;

  productsInHtml: boolean;
  noProducts: boolean;
  /* Boolean Variables */

  /* String Variables */
  firstname: String;
  imageTarget: String;
  imageSelected: String;
  reminderMsg: String = "Please upload an image to continue..";

  imageEditUrl: String;
  imageEditName: String;
  /* String Variables */

  /* Misc. Variables */
  selectedFile: File = null;
  filename: String = null;
  path: String = null;
  imageValue: String;
  /* Misc. Variables */

  /* Product URL */
  url: String;
  imageEditUpdate: any;
  /* Product URL */

  /* End of Admin Page GLOBAL Variables
  -------------------------------------------------- */



  /* Form 1 Actions & Functions
  -------------------------------------------------- */

  clearForm() {
    this.imageTarget = "";
    this.fileInput.nativeElement.value = "";
  }

  searchProduct(value: any) {
    if (value.search == "" || value.search.length <= 1) {
      this.searchInputArr.length = 0;
    } else {
      this.searchInputArr.push(value);
      if (this.searchInputArr.length >= 1 && this.searchInputArr.length <= 5) {
        //!GET SINGLE/SIMILAR PRODUCT(S)//
        this._market.getAllProducts().subscribe(data => {
        });
      }
    }
  }

  allValues(value: any) {
    if (value.productName && value.productPrice && value.category) {
      this.reminder = false;
    } else {
      this.reminder = true;
    }
  }

  onSubmit(value: any) {
    const newProduct = {
      name: value.productName,
      category: value.category,
      price: value.productPrice,
      image: this.selectedFile.name
    };
    this._market.adminAddProduct(newProduct).subscribe(data => {
      value = "";
      this.hideProductDetails = false;
      this.disableEnableBtn = false;
      this.hideProductForm = true;
      this.clearForm();
      this.uploadButton = false;

      this._market.getAllProducts().subscribe(data => {
        this.marketProducts = data[0];
        if (this.marketProducts == [] || this.marketProducts == "") {
          this.productsInHtml = true;
          this.noProducts = false;
        } else {
          this.productsInHtml = false;
          this.noProducts = true;
        }
      });
    }),
      (err: any) => {
        console.log(err);
      };
  }

  /* End of Form 1 Actions & Functions
  -------------------------------------------------- */



  /* Form Img Actions & Functions
  -------------------------------------------------- */

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageTarget = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.reminder = true;
  }

  uploadImage() {
    this.uploadButton = true;
    const fd = new FormData();
    fd.append("image", this.selectedFile, this.selectedFile.name);

    this._http
      .post("http://localhost:3000/products/upload", fd)
      .subscribe(res => {});
  }

  /* End of Form Img Actions & Functions
  -------------------------------------------------- */



  /* Form Edit Actions & Functions
  -------------------------------------------------- */

  checkValues(value: any){
    console.log(value);
  }

  editFile(event: any) {
    if(event !== "" || event !== null){
      this.imageEditUpdate = event.target.files[0];
      this.imageEditName = event.target.files[0].name
      const fd = new FormData();
      fd.append("image", this.imageEditUpdate, this.imageEditUpdate.name);
  
      this._http
      .post("http://localhost:3000/products/upload", fd)
      .subscribe(res => {
      this.imageEditUrl =  "http://localhost:3000/public/uploads/" + res[0].filename });  
    } else {
      return this.imageEditUpdate = null
    }
  }


  updateProduct(value: any){


    if(!value.productNameEdit || value.productNameEdit == undefined){
      value.productNameEdit = this.defaultProductValues.productName
    }
    if(!value.productCategoryEdit || value.productCategoryEdit == undefined){
      value.productCategoryEdit = this.defaultProductValues.category_id
    }
    if(!value.productPriceEdit || value.productPriceEdit == undefined){
      value.productPriceEdit = this.defaultProductValues.priceEdit
    }
    
  
    if(this.imageEditName == null || this.imageEditName == undefined){
      this.imageEditName = this.defaultProductValues.defaultImage
    }
        

    const editDetails = {
      id: this.defaultProductValues.serialNumber,
      productname: value.productNameEdit,
      category_id: value.productCategoryEdit,
      price: value.productPriceEdit,
      image: this.imageEditName
    }
     
    this._market.adminEditProduct(editDetails).subscribe(data=>{
        this._market.getAllProducts().subscribe(data => {
          this.marketProducts = data[0];
          this.clearProduct()
        });
    })

  }

  /* End of Form Edit Actions & Functions
  -------------------------------------------------- */



  /* BTNs Functions
  -------------------------------------------------- */
  showProductForm() {
    setTimeout(() => {
      this.hideProductDetails = true;
      this.disableEnableBtn = true;
      this.hideProductForm = false;
    }, 300);
  }

  cancelAdd() {
    setTimeout(() => {
      this.hideProductDetails = false;
      this.disableEnableBtn = false;
      this.hideProductForm = true;
      this.clearForm();
    }, 300);
  }

  /* End of BTNs Functions
  -------------------------------------------------- */



  /* Product SideBar Section
  -------------------------------------------------- */

  showProductFunc(value: any) {
    this.marketProducts.forEach(prod => {
      if (value == prod._id) {
        this.categories.forEach(cat => {
          if (prod.category_id == cat._id) {
            this.productShow = [prod, cat];            
            this.imageEditUrl =
              "http://localhost:3000/public/uploads/" + prod.product_img;
            this.defaultProductValues = {
              serialNumber: prod._id,
              productName: prod.productName,
              category_id: cat._id,
              categoryName: cat.category,
              priceEdit: prod.price,
              defaultImage: prod.product_img
            }                       
          }
        });
      }
    });
  }

  clearProduct() {
    this.productShow = "";
  }

  /* End of Product SideBar Section
  -------------------------------------------------- */



  ngOnInit() {
    this._api.postVerifyCustomer().subscribe(details => {
    if(details[0] == true){
        this.router.navigate(['/'])        
      } else {
        this.firstname = details[1];
        this._market.getCategories().subscribe(data => {
          this.categories = data;
        });
    
        this._market.getAllProducts().subscribe(data => {
          this.marketProducts = data[0];
          if (this.marketProducts == [] || this.marketProducts == "") {
            this.productsInHtml = true;
            this.noProducts = false;
          } else {
            this.productsInHtml = false;
            this.noProducts = true;
          }
        });
      }
    });
  }
}
