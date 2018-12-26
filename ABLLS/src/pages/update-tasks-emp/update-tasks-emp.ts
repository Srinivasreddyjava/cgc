import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UpdateTaskForChildPage } from '../update-task-for-child/update-task-for-child';

@IonicPage()
@Component({
  selector: 'page-update-tasks-emp',
  templateUrl: 'update-tasks-emp.html',
})
export class UpdateTasksEmpPage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {}
  children;
  ngOnInit(){
    // Get this employee children
    this.getEmpChildren();
  }

  getEmpChildren(){
    this.auth.getEmpChildren(this.auth.emp_dets[0]._id).subscribe(res => {
      if (res.success){
        this.children = res.msg;
      }else { 
        console.log(res);
      }
    })
  }

  updateClicked(child){
    this.navCtrl.push(UpdateTaskForChildPage, { child: child });
  }

}
