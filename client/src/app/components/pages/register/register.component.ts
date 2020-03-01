import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service'
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

import { Customer } from '../../../interface/Customer'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {



  /* Output/Input Decorators (New EventEmmiter)
-------------------------------------------------- */

  // @Input() passName = new EventEmitter<any>();

/* End of Output/Input Decorators (New EventEmmiter)
-------------------------------------------------- */



  constructor(private formBuilder: FormBuilder, private apiService:ApiService, private router:Router) { 
    // console.log(this.passName);
  }
  /* Register Component GLOBAL Variables
  -------------------------------------------------- */
  cities: any

  passwordConfirmed: any

  /* Boolean Variables */
  err: any;
  err2: boolean = true

  email: boolean = false
  id: boolean = false

  details: any
  show: boolean

  nextstep: boolean;
  step2: any
  /* Boolean Variables */

  /* String Variables */
  step2err: String = "ID and/or Email already exist! Please try again"
  isConfirmed: boolean = false
  /* String Variables */

  customer: Customer  
  /* End of Register Component GLOBAL Variables
  -------------------------------------------------- */

  registerForm = this.formBuilder.group({
    firstname: [null, Validators.required],
    lastname: [null, Validators.required],
    email: [null, Validators.required],
    idnumber: [null, Validators.required],
    password: [null, Validators.required],
    city: [null, Validators.required],
    street: [null, Validators.required]
  })

  
    inputValue(){
      this.err = true
    }

    /*=============================================
    =             Input Values & Form             =
    =============================================*/
   
    
    styleCheck(value: any): object{
      
      if(this.isConfirmed == false && value.password !== value.confirmPassword){
        return { "border-left": "3px solid #a94442",
        "border-right": "3px solid #a94442" }
      }
    }
      


    keyCheck(value: any){
      if(value.idnumber == ""){
        this.nextstep = false
        this.id = true
      } else {
        if(value.idnumber !== ""){
          
          this.id = false
          this.err2 = true
        }        
      }
      if(value.email == ""){
        this.email = true
        this.nextstep = false
      } else {
        if(value.email !== ""){
          this.email = false
        }
      }

      if(value.password !== value.confirmPassword){
        this.nextstep = false
        this.isConfirmed = false
        this.passwordConfirmed = ""  
      } else {
        if(value.password == value.confirmPassword){
        this.passwordConfirmed = [value.password = value.confirmPassword]
        this.isConfirmed = true
        }
      }

      /* Step 1 / Step 2 Conditions */
      if(value.idnumber && value.email && this.passwordConfirmed != ""){
        this.nextstep = true
      } else {
        this.nextstep = false
    }
    /* Step 1 / Step 2 Conditions */  
  }
    

    nextStep(value: any){
      this.apiService.postCheckCustomer(value).subscribe((confirmation=>{       
        if(confirmation == "failed"){
            this.step2 = false
            this.err2 = false
          } else {
            if(confirmation == "clear"){
              this.step2 = true
              this.err2 = true
            }
          }
      }))
    }


    onSubmit(value: any) {
      var details = value
      this.apiService.postNewCustomer(details).subscribe(( result => {  
        localStorage.setItem('userKey', result.userKey.token);
        this.router.navigate(['/register/process'])
      }))
    }

  

    /*============  End of Input Values & Form  =============*/


    
    /* "Login Now!" Alert
    -------------------------------------------------- */
    showHideLoginNow(value: any){
      if(value !== ""){
        this.show = true 
      }

    }
    /* End of "Login Now!" Alert
    -------------------------------------------------- */

  
  ngOnInit() {
    this.apiService.getIsraelCities().subscribe((data=>{
      this.cities = data
   }))   
  }
}