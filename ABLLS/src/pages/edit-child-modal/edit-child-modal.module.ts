import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditChildModalPage } from './edit-child-modal';

@NgModule({
  declarations: [
    EditChildModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditChildModalPage),
  ],
})
export class EditChildModalPageModule {}
