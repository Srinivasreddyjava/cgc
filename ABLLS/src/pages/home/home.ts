import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  email: string;
  password: string;
  logged_in = false;

  mode = "emp";
  admin_mode = false;
  emp_mode = true;

  role = 'emp';

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private auth: AuthService, private toast: ToastController, private storage: Storage) { }

  ionViewWillEnter() {

    this.storage.get('mode').then(data => {
      if (data && data.length > 0) {
        this.auth.setAuth(data, '');
        this.navCtrl.push(DashboardPage);
      } else {
        // return false;
      }
    }).catch(err => { console.error(err); });

  }

  onAdminSignin(form) {
    // Show loading
    const load = this.loadingCtrl.create({
      content: 'Logging you in..',
    });
    load.present();
    // Validate
    // form.value.email, form.value.password
    let email = form.value.email;
    let password = form.value.password;
    const obj = { email: email, password: password };
    this.auth.authenticateAdmin(obj).subscribe(res => {
      if (res.success) {
        // Log user in
        load.dismiss();
        this.auth.mode = "admin";
        this.auth.setAuth("admin", res.msg);
        form.reset();
        this.navCtrl.push(DashboardPage);
      } else {
        load.dismiss();
        const t = this.toast.create({
          message: 'Wrong credentials',
          duration: 1200
        });
        t.present();
        form.reset();
      }
    });
  }

  onEmpSignin(f) {
    // Show loading
    const load = this.loadingCtrl.create({
      content: 'Logging you in..',
    });
    load.present();
    // Validate
    // form.value.email, form.value.password
    let email = f.value.email;
    let password = f.value.password;
    this.auth.authenticateStaff({ email: email, password: password }).subscribe(res => {
      if (res.success) {
        // Log user in
        load.dismiss();
        this.auth.setAuth("emp", res.msg);
        // this.auth.mode = "emp";
        // this.auth.emp_dets = res.msg;
        f.reset();
        this.navCtrl.push(DashboardPage);
      } else {
        load.dismiss();
        const t = this.toast.create({
          message: 'Wrong credentials',
          duration: 1200
        });
        t.present();
        f.reset();
      }
    });
  }

  // modeChanged(event) {
  //   if (event === 'emp') {
  //     this.admin_mode = false;
  //     this.emp_mode = true;
  //   }
  //   if (event === 'admin') {
  //     this.admin_mode = true;
  //     this.emp_mode = false;
  //   }
  // }

  changed() {
    if (this.mode === 'emp') {
      this.admin_mode = false;
      this.emp_mode = true;
    }
    if (this.mode === 'admin') {
      this.admin_mode = true;
      this.emp_mode = false;
    }
  }
}
