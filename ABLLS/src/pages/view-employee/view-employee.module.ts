import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewEmployeePage } from './view-employee';

@NgModule({
  declarations: [
    ViewEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewEmployeePage),
  ],
})
export class ViewEmployeePageModule {}
