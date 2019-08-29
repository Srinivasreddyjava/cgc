import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-edit-child-modal',
  templateUrl: 'edit-child-modal.html',
})
export class EditChildModalPage {

  child;
  first_name;
  last_name;
  age;
  parent_name;
  parent_mobile;
  time_slot;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private auth: AuthService, private load: LoadingController, private toast: ToastController, private alertCtrl: AlertController) {}

  ionViewWillEnter(){
    const c = this.child = this.navParams.get('child');
    this.first_name = c.first_name;
    this.last_name = c.last_name;
    this.age = c.age;
    this.parent_name = c.parent_name;
    this.parent_mobile = c.parent_mobile;
    this.time_slot = c.time_slot;
    this.email=c.email;
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }
  editChild(form){
    const loader = this.load.create({
      content: 'Updating..'
    });
    loader.present();

    const child_obj= {
      id: this.child._id,
      first_name: this.first_name,
      last_name: this.last_name,
      age: this.age,
      parent_name: this.parent_name,
      parent_mobile: this.parent_mobile,
      time_slot: this.time_slot,
      email:this.email
    };
    this.auth.updateChild(child_obj).subscribe(res => {
      if (res.success){
        loader.dismiss();
        const toast = this.toast.create({
          message: 'Updated !',
          duration: 1200
        });
        toast.present();
        this.viewCtrl.dismiss('refresh', res.msg);
      }else {
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'Please try again later',
          buttons: ['Ok']
        });
        alert.present();
      }
    }, err => console.error(err));
  }

}
