import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

hideRegLog: boolean;
pathName: any
  // @Output() redirectlog = new EventEmitter();

  // redirectLogin(){
  //   this.redirectlog.emit(this.redirectlog)
  // }

  
  loginLink(){
    
  }

  constructor(private router:Router) { }


  ngOnInit() { 
  }

}
