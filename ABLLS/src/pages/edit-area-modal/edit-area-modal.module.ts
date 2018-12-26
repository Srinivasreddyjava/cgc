import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAreaModalPage } from './edit-area-modal';

@NgModule({
  declarations: [
    EditAreaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAreaModalPage),
  ],
})
export class EditAreaModalPageModule {}
