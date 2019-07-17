import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule  } from '@ionic/storage';
// Printer
import { Printer } from '@ionic-native/printer';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthService } from '../services/auth';
import { HttpModule } from '@angular/http';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AddAreasPage } from '../pages/add-areas/add-areas';
import { EditAreasPage } from '../pages/edit-areas/edit-areas';
import { EditAreaModalPage } from '../pages/edit-area-modal/edit-area-modal';
import { AddTasksPage } from '../pages/add-tasks/add-tasks';
import { EditTaskModalPage } from '../pages/edit-task-modal/edit-task-modal';
import { AddChildPage } from '../pages/add-child/add-child';
import { ViewChildrenPage } from '../pages/view-children/view-children';
import { ChildPage } from '../pages/child/child';
import { EditChildModalPage } from '../pages/edit-child-modal/edit-child-modal';
import { AssignAreasPage } from '../pages/assign-areas/assign-areas';
import { TasksChecklistModalPage } from '../pages/tasks-checklist-modal/tasks-checklist-modal';
import { UpdateTaskPage } from '../pages/update-task/update-task';
import { UpdateTaskForChildPage } from '../pages/update-task-for-child/update-task-for-child';
import { AddEmployeePage } from '../pages/add-employee/add-employee';
import { ViewEmployeePage } from '../pages/view-employee/view-employee';
import { EmployeePage } from '../pages/employee/employee';
import { AssignEmployeePage } from '../pages/assign-employee/assign-employee';
import { ViewEmployeeChildrenPage } from '../pages/view-employee-children/view-employee-children';
import { UpdateTasksEmpPage } from '../pages/update-tasks-emp/update-tasks-emp';
import { EditChildTaskPage } from '../pages/edit-child-task/edit-child-task';
import { ChangePasswordPage } from '../pages/change-password/change-password';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DashboardPage,
    AddAreasPage,
    EditAreasPage,
    EditAreaModalPage,
    AddTasksPage,
    EditTaskModalPage,
    AddChildPage,
    ViewChildrenPage,
    ChildPage,
    EditChildModalPage,
    AssignAreasPage,
    TasksChecklistModalPage,
    UpdateTaskPage,
    UpdateTaskForChildPage,
    AddEmployeePage,
    ViewEmployeePage,
    EmployeePage,
    AssignEmployeePage,
    ViewEmployeeChildrenPage,
    UpdateTasksEmpPage,
    EditChildTaskPage,
    ChangePasswordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DashboardPage,
    AddAreasPage,
    EditAreasPage,
    EditAreaModalPage,
    AddTasksPage,
    EditTaskModalPage,
    AddChildPage,
    ViewChildrenPage,
    ChildPage,
    EditChildModalPage,
    AssignAreasPage,
    TasksChecklistModalPage,
    UpdateTaskPage,
    UpdateTaskForChildPage,
    AddEmployeePage,
    ViewEmployeePage,
    EmployeePage,
    AssignEmployeePage,
    ViewEmployeeChildrenPage,
    UpdateTasksEmpPage,
    EditChildTaskPage,
    ChangePasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    Printer,
    File,
    FileOpener,
    FileTransfer,
    FilePath,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
