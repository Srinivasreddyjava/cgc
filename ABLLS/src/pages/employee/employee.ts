import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { AssignEmployeePage } from '../assign-employee/assign-employee';
import { ChildPage } from '../child/child';

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmployeePage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private loadCtrl: LoadingController, private toast: ToastController, private alertCtrl: AlertController) {}

  emp;
  name;
  email;
  mobile;
  password;
  emp_children;
  number;


  ionViewWillEnter(){
    this.getEmpChildren();
  }

  ngOnInit(){
    this.emp = this.navParams.get('employee');  
    this.name= this.emp.name;
    this.email= this.emp.email;
    this.mobile= this.emp.mobile;
    this.password= this.emp.password;  
    this.number = this.emp.number;

    this.getEmpChildren();
  }
  updateEmployee(){
    const load = this.loadCtrl.create({
      content: 'Updating employee..'
    });
    load.present();
    const emp = {
      id: this.emp._id,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      password: this.password,
      number: this.number
    }
    this.auth.updateEmployee(emp).subscribe(res => {
      if(res.success){
        load.dismiss();
        const toast = this.toast.create({
          message: 'Employee updated successfully !',
          duration: 1200
        });
        toast.present();
      }else {
        console.log(res);
        const toast = this.toast.create({
          message: 'Something went wrong !',
          duration: 1200
        });
        toast.present();
      }
    }, err => console.log(err));
  }
  assignEmployee(){
    this.navCtrl.push(AssignEmployeePage, {e: this.emp});
  }
  // Get assigned children
  getEmpChildren(){
    this.auth.getEmpChildren(this.emp._id).subscribe(res => {
      if(res.success) {
        this.emp_children = res.msg;
      }else {
        // Something went wrong
      }
    }, err => console.error(err));
  }
  gotoChild(child){
    this.navCtrl.push(ChildPage, {child: child});
  }

  deregisterEmployee() {
    
    const alert = this.alertCtrl.create({
      message: 'This action is not reversible',
      buttons: [
        {
          text: 'I\'m sure',
          handler: () => {
            this.auth.deRegisterEmployee(this.emp._id).subscribe(res => {
              if (res.success) {
                const toast = this.toast.create({
                  message: 'Deregistered successfully',
                  duration: 1200
                });
                toast.present();
                this.navCtrl.popToRoot();
              } else {
                console.log(res);
                const toast = this.toast.create({
                  message: 'Something went wrong !',
                  duration: 1200
                });
                toast.present();
              }
            });
          }
        },
        {
          text: 'Cancel',
        }
      ]
    });
    alert.present();
  }

}
