import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-update-task-for-child',
  templateUrl: 'update-task-for-child.html',
})
export class UpdateTaskForChildPage implements OnInit{

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private auth: AuthService,
    // private loadCtrl: LoadingController,
    // private alertCtrl: AlertController,
    private toast: ToastController) {}

  child;
  goals;
  done;
  goal_areas = [];
  done_areas = [];

  ngOnInit(){
    this.child = this.navParams.get('child');
    this.updateChildTasks();
  }

  updateChildTasks(){
    this.auth.getChildTasks(this.child._id).subscribe(res => {
      if(res.success){
        this.goals = res.msg[0];
        console.log(this.goals);
        res.msg[0].forEach(element => {
          if(this.goal_areas.indexOf(element.area_name) < 0){
            // Push
            this.goal_areas.push(element.area_name);
          }
        });
        this.done = res.msg[1];
        res.msg[1].forEach(elt => {
          if(this.done_areas.indexOf(elt.area_name) < 0){
            // Push
            this.done_areas.push(elt.area_name);
          }
        });
      }else {
        console.log('res.msg');
      }
    }, err => console.log(err));
  }

  addToTasks(res){
    // this.tasks = res[0].tasks;
  }
  taskUpdated(event, task){
    // save task
    this.auth.updateChildTask({ task_id: task.task_id, status: task.status, child_id: this.child._id, area_id: task.area_id,  task_name: task.task_name }).subscribe(res => {
      if(res.success){
        // Task updated
        const toast = this.toast.create({
          message: 'Task updated successfully !',
          duration: 1200
        });
        this.updateChildTasks();
        toast.present();
      }else {
        console.log(res);
      }
    }, err => {
      console.log(err);
    });
  }

}
