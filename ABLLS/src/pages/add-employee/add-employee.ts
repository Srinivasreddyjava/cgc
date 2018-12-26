import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-add-employee',
  templateUrl: 'add-employee.html',
})
export class AddEmployeePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController, private auth: AuthService, private toast: ToastController) {}

  onAddEmp(f: any){
    // Loading
    const load = this.loadingCtrl.create({
      content: 'Adding employee..'
    });
    load.present();
    // Add employee here
    const emp = {
      name: f.value.name,
      mobile: f.value.mobile,
      email: f.value.email,
      password: f.value.password,
      number: f.value.number
    };
    console.log(f.value.number);
    this.auth.addEmployee(emp).subscribe(res => {
      if(res.success) {
        load.dismiss();
        const toast = this.toast.create({
          message: 'Employee added successfully !',
          duration: 1200
        });
        toast.present();
        f.reset();
      }else {
        console.log(res);
      }
    }, err => { console.error(err); });
  }
}
