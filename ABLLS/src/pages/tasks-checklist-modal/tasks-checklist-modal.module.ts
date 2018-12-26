import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TasksChecklistModalPage } from './tasks-checklist-modal';

@NgModule({
  declarations: [
    TasksChecklistModalPage,
  ],
  imports: [
    IonicPageModule.forChild(TasksChecklistModalPage),
  ],
})
export class TasksChecklistModalPageModule {}
