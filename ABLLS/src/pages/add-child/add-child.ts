import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-add-child',
  templateUrl: 'add-child.html',
})
export class AddChildPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, private auth: AuthService) {}


  onAddChild(form){
    const load = this.loadCtrl.create({
      content: 'Registering '+ form.value.first_name +' with organization..'
    });
    load.present();

    const child_obj = {
      number: form.value.number,
      first_name: form.value.first_name.trim(),
      last_name: form.value.last_name.trim(),
      age: form.value.age,
      parent_name: form.value.parent_name.trim(),
      parent_mobile: form.value.parent_mobile,
      time_slot: form.value.from_slot +" - "+form.value.to_slot
    };
    this.auth.addChild(child_obj).subscribe(res => {
      if(res.success){
        load.dismiss();
        const toast = this.toastCtrl.create({
          message: 'Registered '+ form.value.first_name + ' !',
          duration: 1200
        });
        toast.present();
        form.reset();
      }else {
        load.dismiss();
        const alrt = this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'Please try again later',
          buttons: ['Ok']
        });
        alrt.present();
      }
    }, err => console.error(err)
  )
  }

}
