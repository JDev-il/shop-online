import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customernav',
  templateUrl: './customernav.component.html',
  styleUrls: ['./customernav.component.css']
})

export class CustomernavComponent implements OnInit {

  firstname: String  

  constructor(private _api:ApiService, private router:Router) { }

  removeToken(){
    localStorage.removeItem("userKey")
  }
  
  ngOnInit() {
    this._api.postVerifyCustomer().subscribe(details => {
    if(details[0] == false){
          this.router.navigate(['/'])        
      } else {
        this.firstname = details[1]
      }
    })
  }


}
