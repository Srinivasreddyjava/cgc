import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { EditTaskModalPage } from '../edit-task-modal/edit-task-modal';

@IonicPage()
@Component({
  selector: 'page-add-tasks',
  templateUrl: 'add-tasks.html',
})
export class AddTasksPage implements OnInit{

  area_id; area_name; tasks;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private loadCtrl: LoadingController, private alertCtrl: AlertController, private toast: ToastController, private modalCtrl: ModalController) {}

  ngOnInit(){
    // Get parameters
    this.area_id = this.navParams.get('area_id');
    this.area_name = this.navParams.get('area_name');
    // Get tasks of area
    this.loadTasks();
  }
  taskSubmit(f){
    const load = this.loadCtrl.create({
      content: 'Adding task to '+ this.area_name,
    });
    load.present();
    const task_name = f.value.task_name;
    this.auth.addTaskToArea({name: task_name, area_id: this.area_id}).subscribe(res => {
      if(res.success){
        f.reset();        
        load.dismiss();
        // reload tasks
        this.loadTasks();
        const toast = this.toast.create({
          message: 'Task added successfully',
          duration: 1200
        });
        toast.present();
      }else {
        load.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'Please try again later',
          buttons: ['Ok']
        });
        alert.present();
      }
    }, err => {
      console.error(err);
    });
  }

  editTask(i: string, task_name: string){
    const obj = { name: task_name, id: i };
    const modal = this.modalCtrl.create(EditTaskModalPage, obj);
    modal.present();
    modal.onDidDismiss((refresh: string)=>{
      if(refresh === "refresh"){
        this.loadTasks();
      }
    })
  }

  loadTasks(){
  // Get tasks of area
  this.auth.getTasksOfArea(this.area_id).subscribe(res => {
    if(res.success){
      this.tasks = res.msg;
    }else {
      this.tasks = null;
    }
  });
  }
}
