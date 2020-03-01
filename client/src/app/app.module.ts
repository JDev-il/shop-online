import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'

/* Services
-------------------------------------------------- */
import { ApiService } from './services/api.service';
import { MarketApiService } from './services/marketServices/market-api.service';
import { CounterModule } from 'ngx-counter';
/* End of Services
-------------------------------------------------- */



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/navbars/nav/nav.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { CustomersPageComponent } from './components/pages/market/customers-page/customers-page.component';
import { AdminPageComponent } from './components/pages/market/admin-page/admin-page.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisternavComponent } from './components/navbars/registernav/registernav.component';
import { LoginnavComponent } from './components/navbars/loginnav/loginnav.component';
import { RegisterformComponent } from './components/forms/registerform/registerform.component';
import { PleasewaitComponent } from './components/pages/transitions/pleasewait/pleasewait.component';
import { LogintransitionComponent } from './components/pages/transitions/logintransition/logintransition.component';
import { AdminnavComponent } from './components/navbars/adminnav/adminnav.component';
import { CustomernavComponent } from './components/navbars/customernav/customernav.component';
import { OrdersPageComponent } from './components/pages/market/orders-page/orders-page.component';

const appRoutes: Routes = [

  
  /*=============================================
  =            Login/Register Pages             =
  =============================================*/
  
      {path: '', component: LoginComponent },
      {path: 'register', component: RegisterComponent },

      /* Transitions
      -------------------------------------------------- */
      {path: 'register/process', component: PleasewaitComponent },
      {path: 'login/process', component: LogintransitionComponent },
      /* End of Subsection
      -------------------------------------------------- */
  
  /*============  End of Login/Register Pages  =============*/


  /*=============================================
  =                Market Pages                 =
  =============================================*/
  
      /* Admin Pages */  
      {path: 'market/admin', component: AdminPageComponent },
      /* End of Admin Pages */
  
      /* Customer Pages */        
      {path: 'market/customer', component: CustomersPageComponent },
      /* End of Customer Pages */

      /* Orders Pages */        
      {path: 'market/order', component: OrdersPageComponent },
      /* End of Orders Pages */
  
  /*==========  End of Market Pages  ==========*/


  // { path: '404', component: PagenotfoundComponent},
  { path: '**', redirectTo: '404'}
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CustomersPageComponent,
    AdminPageComponent,
    NavComponent,
    RegisternavComponent,
    LoginnavComponent,
    RegisterformComponent,
    PleasewaitComponent,
    LogintransitionComponent,
    AdminnavComponent,
    CustomernavComponent,
    OrdersPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
 
    // Specify the library as an import
    CounterModule.forRoot()
  ],
  providers: [
    // provide: HTTP_INTERCEPTORS,
    // useClass: TokenCheckerService,
    // multi: true
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
