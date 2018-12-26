import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-assign-employee',
  templateUrl: 'assign-employee.html',
})
export class AssignEmployeePage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private toastCtrl: ToastController) {}

  employee;
  children;

  ngOnInit(){
    this.employee = this.navParams.get('e');
    this.getChildren();
  }

  getChildren(){
    this.auth.getUnEmpChildren().subscribe(res => {
      if(res.success){
        this.children = res.msg;
      }else {
        // Something went wrong
      }
    });
  }
  assignChild(c){
    const obj = {
      c_id: c._id,
      e_id : this.employee._id
    };
    this.auth.addStaffToChild(obj).subscribe(res => {
      if(res.success){
        const toast = this.toastCtrl.create({
          message: 'Added child successfully !',
          duration: 1200
        });
        toast.present();
        this.getChildren();
      }else {
        const toast = this.toastCtrl.create({
          message: 'Something went wrong !',
          duration: 1200
        });
        toast.present();
      }
    }, err => {
      console.error(err);
    });
  }
}
