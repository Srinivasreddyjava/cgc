import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTasksPage } from './add-tasks';

@NgModule({
  declarations: [
    AddTasksPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTasksPage),
  ],
})
export class AddTasksPageModule {}
