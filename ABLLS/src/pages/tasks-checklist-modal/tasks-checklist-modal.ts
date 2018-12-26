import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@IonicPage()
@Component({
  selector: 'page-tasks-checklist-modal',
  templateUrl: 'tasks-checklist-modal.html',
})
export class TasksChecklistModalPage {

  area_id: string;
  area;
  tasks;
  child;
  child_id;
  all_tasks;
  child_tasks;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthService, 
    private viewCtrl: ViewController, 
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController) {}

  ionViewWillEnter(){
    this.area = this.navParams.get('area');
    this.child = this.navParams.get('child');
    this.child_id = this.child._id;
    this.area_id = this.area._id;
    this.loadTasks();
  }

  loadTasks(){
    this.auth.getTasksOfArea(this.area_id).subscribe(res => {
      if(res.success){
        // this.tasks = res.msg;
        this.all_tasks = res.msg;
        this.getChildTasks();
      }else{  
        // console.log(res);
      }
    }, err => console.error(err));
  }
  getChildTasks(){
    this.auth.getRawChildTasks(this.child_id).subscribe(res => {
      if(res.success){
        this.child_tasks = res.msg;
        this.assignTasks();;
      }else {
        console.log(res);
      }
    }, err => console.error(err));
  }
  assignTasks(){
    
    const ctask: Array<String> = [];

    if(this.child_tasks.length > 0){
      this.child_tasks[0].tasks.forEach(element => {
        ctask.push(element.task_id);
      });
    }

    
    
    // Compare child tasks and all tasks

    this.all_tasks.forEach(element => {
        if (this.child_tasks.length > 0) {
          this.child_tasks[0].tasks.forEach(e => {
    
            if(ctask.indexOf(element._id) > -1){
              element.check = true;
            } else {
              element.check = false;
            }
    
          });
        }else {
            element.check = false;
        }
    });
    this.addToTasks();
  }
  addToTasks(){
    this.tasks = this.all_tasks;
  }
  taskChecked(event, id: string, task){
    if(event.checked){
      const load = this.loadingCtrl.create({
        content: 'Adding task..'
      });
      load.present();
      // Add id to this.child.
      this.auth.addTaskToChild( { task_id: id, area_id: task.area_id ,child_id: this.child_id } ).subscribe( res => {
        if(res.success){
          load.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Task added successfully !',
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
      }, err => console.error(err));
    }else {
      const load = this.loadingCtrl.create({
        content: 'Removing task..'
      });
      load.present();
      this.auth.removeTaskToChild({ task_id: id, child_id: this.child_id }).subscribe( res => {
        if(res.success){
          load.dismiss();
          const toast = this.toastCtrl.create({
            message: 'Task removed successfully !',
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
      }, err => console.log(err));
    }
  }
  closeModal(){
    this.viewCtrl.dismiss();
  }

}
