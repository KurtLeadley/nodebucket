/***********************************
; Title:  App Router
; Author: Kurt Leadley
; Date:   15 March 2020
; Description: These are all our route paths, some with auth guards
***************************************************************/
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TaskListComponent } from "./tasks/task-list/task-list.component";
import { MyTaskListComponent } from "./tasks/task-list/mytask-list.component";
import { TaskCreateComponent } from "./tasks/task-create/task-create.component";
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AboutComponent} from './about/about.component';
import {NotfoundComponent} from './notfound/notfound.component';
import { AuthGuard } from './auth/auth.guard';
import {RoleGuard} from './auth/role.guard';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'mytasks/:eid', component: MyTaskListComponent, canActivate: [AuthGuard] },
  { path: 'alltasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: TaskCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:taskId', component: TaskCreateComponent, canActivate: [AuthGuard] },
  // have extra guard for admin path
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard,RoleGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  // when we can't find the route, send to NotfoundComponent
  { path: '**', pathMatch: "full", component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard]
})
export class AppRoutingModule {}
