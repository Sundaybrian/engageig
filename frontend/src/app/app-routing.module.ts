import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginpageComponent } from "./pages/loginpage/loginpage.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { RegisterpageComponent } from "./pages/registerpage/registerpage.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  { path: "login", component: LoginpageComponent },
  { path: "register", component: RegisterpageComponent },
  { path: "logout", component: LoginpageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
