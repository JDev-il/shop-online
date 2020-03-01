import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MarketApiService } from 'src/app/services/marketServices/market-api.service';

@Component({
  selector: 'app-logintransition',
  templateUrl: './logintransition.component.html',
  styleUrls: ['./logintransition.component.css']
})
export class LogintransitionComponent implements OnInit {

  firstname: String

  hideAdmin: boolean;
  hideCustomer: boolean;

  constructor(private _api:ApiService, private router:Router, private _market:MarketApiService) { }



  adminRedirect(){
    setTimeout(() => {
      this.router.navigate(['/market/admin'])          
    }, 2500);
  }
  customerRedirect(){
    setTimeout(() => {
      this.router.navigate(['/market/customer'])          
    }, 2500);
  }



  ngOnInit() {
     
    this._api.postVerifyCustomer().subscribe((data)=>{
      this.firstname = data[1]
      if(data[0] == false){
        this.hideAdmin = true
        this.hideCustomer = false
        this.adminRedirect()
      }
      if(data[0] == true){
          this.hideCustomer = true
          this.hideAdmin = false
          this.customerRedirect()
      }
    })
  }
}
