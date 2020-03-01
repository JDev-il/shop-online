import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-pleasewait',
  templateUrl: './pleasewait.component.html',
  styleUrls: ['./pleasewait.component.css']
})
export class PleasewaitComponent implements OnInit {

  firstname: String

constructor(private _api:ApiService, private router:Router) { }


  redirect(){
    setTimeout(() => {
      this.router.navigate(['/market/customer'])
    }, 2500);
  }


  ngOnInit() {
     
    this._api.postVerifyCustomer().subscribe((data)=>{
      this.firstname = data[1]
      this.redirect()  
    })   
  }
}
