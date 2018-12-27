import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController, AlertController, Platform } from 'ionic-angular';
import { EditChildModalPage } from '../edit-child-modal/edit-child-modal';
import { AuthService } from '../../services/auth';
import { AssignAreasPage } from '../assign-areas/assign-areas';
import { Printer } from '@ionic-native/printer';
import { EditChildTaskPage } from '../edit-child-task/edit-child-task';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-child',
  templateUrl: 'child.html',
})
export class ChildPage implements OnInit {

  child;
  goals;
  done;
  goal_areas;
  done_areas;

  constructor(public navCtrl: NavController, public navParams: NavParams, private load: LoadingController, private modalCtrl: ModalController, private auth: AuthService, private toast: ToastController, private alertCtrl: AlertController, private printer: Printer, private plt: Platform, private file: File, private fileOpener: FileOpener) { }

  ionViewWillEnter() {
    this.child = this.navParams.get('child');
    this.getChildtasks();
  }
  ngOnInit() {
    // this.child = this.navParams.get('child');
  }

  getChildtasks() {
    this.goal_areas = [];
    this.done_areas = [];
    this.auth.getChildTasks(this.child._id).subscribe(res => {
      if (res.success) {
        this.goals = res.msg[0];
        res.msg[0].forEach(element => {
          if (this.goal_areas.indexOf(element.area_name) < 0) {
            // Push
            this.goal_areas.push(element.area_name);
          }
        });
        this.done = res.msg[1];
        res.msg[1].forEach(elt => {
          console.log(elt);
          if (this.done_areas.indexOf(elt.area_name) < 0) {
            // Push
            this.done_areas.push(elt.area_name);
          }
        });
      } else {
      }
    }, err => {
      const toast = this.toast.create({
        message: 'Something went wrong while fetching the child tasks',
        duration: 1200
      });
      toast.present();
    });
  }
  openModel() {
    const obj = { child: this.child };
    const modal = this.modalCtrl.create(EditChildModalPage, obj);
    modal.present();
    modal.onDidDismiss((refresh: string, child_obj) => {
      if (refresh === "refresh") {
        this.child = child_obj;
      }
    })
  }

  editTaskname(task_id, task_name, status) {
    const obj = { child: this.child, task_id: task_id, task_name: task_name, task_status: status };
    const modal = this.modalCtrl.create(EditChildTaskPage, obj);
    modal.present();
    modal.onDidDismiss((refresh: string) => {
      if (refresh === "refresh") {
        this.getChildtasks();
      }
    })
  }

  loadChild() {
    this.auth.getChild(this.child._id).subscribe(res => {
      if (res.success) {
        this.child = res.msg;
      }
    }, error => console.log(error));
  }
  assign_areas() {
    this.navCtrl.push(AssignAreasPage, { child: this.child });
  }

  deregisterChild() {

    const alert = this.alertCtrl.create({
      message: 'This action is not reversible',
      buttons: [
        {
          text: 'I\'m sure',
          handler: () => {
            this.auth.deRegisterChild(this.child._id).subscribe(res => {
              if (res.success) {
                const toast = this.toast.create({
                  message: 'Deregistered successfully',
                  duration: 1200
                });
                toast.present();
                this.navCtrl.popToRoot();
              } else {
                console.log(res);
                const toast = this.toast.create({
                  message: 'Something went wrong !',
                  duration: 1200
                });
                toast.present();
              }
            });
          }
        },
        {
          text: 'Cancel',
        }
      ]
    });
    alert.present();
  }

  print() {
    console.log('Print selected');
    const p = document.getElementById('printable')

    this.printer.isAvailable().then(function () {
      this.printer.print(p).then(() => {
        console.log('error');
      }, () => console.log('Error'));
    })
  }

  pdf(){
    // alert('hole');
  }

  downloadPdf() {

  }

  taskUpdated(event, task){
    task.status = task.status === 'goal'? 'achieved' : 'goal';
    // save task
    this.auth.updateChildTask({ task_id: task.task_id, status: task.status, child_id: this.child._id, area_id: task.area_id,  task_name: task.task_name }).subscribe(res => {
      if(res.success){
        // Task updated
        const toast = this.toast.create({
          message: 'Task updated successfully !',
          duration: 1200
        });
        this.getChildtasks();
        toast.present();
      }else {
        console.log(res);
      }
    }, err => {
      console.log(err);
    });
  }

}
