import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-edit-task-modal',
  templateUrl: 'edit-task-modal.html',
})
export class EditTaskModalPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadCtrl: LoadingController, private alertCtrl: AlertController, private auth: AuthService, private toast: ToastController, private viewController: ViewController) {}

  task_name; task_id;
  inp_task_name;
  
  ngOnInit(){
    this.task_id = this.navParams.get('id');
    this.task_name = this.navParams.get('name');
    this.inp_task_name = this.task_name;
  }

  saveTask(){
    const load = this.loadCtrl.create({
      content: 'Saving..'
    });
    load.present();
    // edit task
    const obj = { task_id: this.task_id, new_name: this.inp_task_name };
    this.auth.editTask(obj).subscribe(res => {
      if(res.success){
        load.dismiss();
        const toast = this.toast.create({
          message: 'Task saved successfully',
          duration: 1200
        });
        toast.present();
        this.viewController.dismiss('refresh');
      }
    }, err=> {  
      console.error(err);
    });
  }

  deleteTask(){
    const load = this.loadCtrl.create({
      content: 'Deleting'
    });
    load.present();
    this.auth.deleteTask(this.task_id).subscribe(res =>{
      if(res.success){
        load.dismiss();
        const toast = this.toast.create({
          message: 'Task deleted successfully',
          duration: 1200
        });
        toast.present();
        this.viewController.dismiss('refresh');
      }else{
        const alrt = this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'Please try again later',
          buttons: ['Ok']
        });
        alrt.present();
        this.viewController.dismiss();
      }
    }, err => {
      console.error(err);
    })
  }
  closeModal(){
    this.viewController.dismiss();
  }
}
