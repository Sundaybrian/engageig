import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { FlashMessagesModule } from "angular2-flash-messages";
import { DataTableModule } from "angular7-data-table";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LoginComponent } from "./components/login/login.component";
import { CasesComponent } from "./components/cases/cases.component";
import { RegisterComponent } from "./components/register/register.component";
import { CaseitemComponent } from "./components/cases/caseitem/caseitem.component";
import { LoginpageComponent } from "./pages/loginpage/loginpage.component";
import { RegisterpageComponent } from "./pages/registerpage/registerpage.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthService } from "./services/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    CasesComponent,
    RegisterComponent,
    CaseitemComponent,
    LoginpageComponent,
    RegisterpageComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    DataTableModule.forRoot(),
    AppRoutingModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
