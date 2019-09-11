import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { EmployeePage } from '../employee/employee';

@IonicPage()
@Component({
  selector: 'page-view-employee',
  templateUrl: 'view-employee.html',
})
export class ViewEmployeePage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
  }

  staff;

  ngOnInit(){
    this.auth.getEmployees().subscribe(res => {
      if(res.success) {
        console.log(res.msg);
        if(res.msg.length>0){
          res.msg.forEach(emp =>{
            this.auth.getEmpChildren(emp._id).subscribe(result =>{
              if(result.success){
                emp.childCount=result.msg.length;
              }
            })
          })
        }
        this.staff = res.msg;
      }else {
        console.log(res);
      }

    }, err => { console.error(err) });
  }

  gotoEmp(e){
    // Employees object is e
    this.navCtrl.push(EmployeePage, { employee: e });
  }


}
