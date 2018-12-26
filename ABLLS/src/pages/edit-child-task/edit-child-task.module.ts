import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditChildTaskPage } from './edit-child-task';

@NgModule({
  declarations: [
    EditChildTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(EditChildTaskPage),
  ],
})
export class EditChildTaskPageModule {}
