import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignEmployeePage } from './assign-employee';

@NgModule({
  declarations: [
    AssignEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(AssignEmployeePage),
  ],
})
export class AssignEmployeePageModule {}
