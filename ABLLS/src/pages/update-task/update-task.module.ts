import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateTaskPage } from './update-task';

@NgModule({
  declarations: [
    UpdateTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateTaskPage),
  ],
})
export class UpdateTaskPageModule {}
