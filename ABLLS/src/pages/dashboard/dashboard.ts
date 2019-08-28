import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddAreasPage } from '../add-areas/add-areas';
import { EditAreasPage } from '../edit-areas/edit-areas';
import { AddChildPage } from '../add-child/add-child';
import { ViewChildrenPage } from '../view-children/view-children';
import { UpdateTaskPage } from '../update-task/update-task';
import { AddEmployeePage } from '../add-employee/add-employee';
import { ViewEmployeePage } from '../view-employee/view-employee';
import { AuthService } from '../../services/auth';
import { ViewEmployeeChildrenPage } from '../view-employee-children/view-employee-children';
import { UpdateTasksEmpPage } from '../update-tasks-emp/update-tasks-emp';
import { Storage } from '@ionic/storage';
import { ChangePasswordPage } from '../change-password/change-password';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  addAreaPage: AddAreasPage;
  editAreasPage: EditAreasPage;
  addChildPage: AddChildPage;
  viewChildrenPage: ViewChildrenPage;
  updateTaskPage: UpdateTaskPage;

  totalEmployees: string;
  totalChildren: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private storage: Storage) {}

  ngOnInit(){
    this.auth.getTotalCounts().subscribe(res => {

      if(res.success) {
        this.totalEmployees = res.staffcount;
        this.totalChildren = res.childcount;
      }else {
        console.log(res);
      }

    }, err => { console.error(err) });
  }

  gotoPage(page: any){
    switch (page) {
      case "add_area":
        this.navCtrl.push(AddAreasPage);
        break;
      case "edit_areas":
        this.navCtrl.push(EditAreasPage);
        break;
      case "add_child":
        this.navCtrl.push(AddChildPage);
        break;
      case "view_children":
        this.navCtrl.push(ViewChildrenPage);
        break;
      case "update_tasks":
        this.navCtrl.push(UpdateTaskPage);
        break;
      case "update_tasks_emp":
        this.navCtrl.push(UpdateTasksEmpPage);
        break;
      case "add_emp":
        this.navCtrl.push(AddEmployeePage);
        break;
      case "view_emp":
        this.navCtrl.push(ViewEmployeePage);
        break;
      case "change_password":
        this.navCtrl.push(ChangePasswordPage);
        break;
      case "view_emp_children":
        if(this.auth.mode == "emp"){
          this.navCtrl.push(ViewEmployeeChildrenPage);
        }
        break;
      default:
        break;
    }
  }
  logout(){
    this.storage.clear();
    this.auth.mode = null;
    this.auth.emp_dets = null;
    this.navCtrl.popToRoot();
  }
}
