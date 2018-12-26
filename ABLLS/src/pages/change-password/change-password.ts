import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: AuthService, public toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePwd(f) {
    const old_p = f.value.old_password;
    const new_p = f.value.new_password;
    const r_new_p = f.value.r_new_password;
    if (new_p === r_new_p) {
      this.service.checkAdminPwd({old: old_p, new: new_p}).subscribe(res => {
        if (res.success) {
          const t = this.toast.create({
            message: 'Updated successfully !',
            duration: 1200
          });
          t.present();
        } else {
          const t = this.toast.create({
            message: 'Wrong password',
            duration: 1200
          });
          t.present();
        }
      })
    } else {
      const t = this.toast.create({
        message: 'Passwords does\'t match',
        duration: 1200
      });
      t.present();
    }
    
  }

}
