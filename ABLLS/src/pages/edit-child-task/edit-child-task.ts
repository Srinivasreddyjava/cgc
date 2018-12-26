import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-edit-child-task',
  templateUrl: 'edit-child-task.html',
})
export class EditChildTaskPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private service: AuthService, public viewCtrl: ViewController, public toastCtrl: ToastController) {
  }

  child;
  task_id;
  task_name;
  task_status;

  ionViewDidLoad() {
    this.child = this.navParams.get('child');
    console.log(this.child);
    this.task_id = this.navParams.get('task_id');
    this.task_name = this.navParams.get('task_name');
    this.task_status = this.navParams.get('task_status');
  }
  editTask(f){
    const obj = {
      child_id: this.child._id,
      task_id: this.task_id,
      task_name: f.value.task_name,
      task_status: this.task_status
    }
    this.service.editChildTask(obj).subscribe(res => {
      if (res.success) {
        const toast  =this.toastCtrl.create({
          message: 'Task saved successfully !',
          duration: 1200
        });
        toast.present();
        this.viewCtrl.dismiss('refresh');
      } else {
        console.log(res.msg);
      }
    })
  }
  closeModal(){
    this.viewCtrl.dismiss('nope');
  }

}
