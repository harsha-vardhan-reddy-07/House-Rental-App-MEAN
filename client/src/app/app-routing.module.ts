import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AdminComponent } from './components/admin/admin.component';
import { OwnerComponent } from './components/owner/owner.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  {path: '', component : LandingComponent},
  {path: 'user', component : UsersComponent},
  {path: 'owner', component : OwnerComponent},
  {path: 'admin', component : AdminComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
