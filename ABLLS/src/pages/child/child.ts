import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { EditChildModalPage } from '../edit-child-modal/edit-child-modal';
import { AuthService } from '../../services/auth';
import { AssignAreasPage } from '../assign-areas/assign-areas';
import { Printer } from '@ionic-native/printer';
import { EditChildTaskPage } from '../edit-child-task/edit-child-task';
import * as moment from 'moment';
import * as jspdf from 'jspdf';

import html2canvas from 'html2canvas';
declare var cordova:any;
@IonicPage()
@Component({
  selector: 'page-child',
  templateUrl: 'child.html',
})
export class ChildPage implements OnInit {

  child;
  goals;
  done;
  mode;
  goal_areas;
  done_areas;
  formattedTimeSlot;
  childHasStaff;
  area_colors = [
    "",
    "visual-performance",
    "receptive-language",
    "imitation",
    "vocal-imitation",
    "requests",
    "labelling",
    "interverbal",
    "spontaneous-vocalizations",
    "syntax-grammer",
    "play-leasure",
    "social-interaction",
    "group-instruction",
    "follow-classroom-routines",
    "generalized-responding",
    "reading",
    "math",
    "writing",
    "spelling",
    "dressing",
    "eating",
    "grooming",
    "toileting",
    "gross-motor",
    "fine-motor"
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private printer: Printer
  ) { }

  ionViewWillEnter() {
    this.child = this.navParams.get('child');
    this.mode=this.auth.mode;
    this.loadChild();
    this.formatTime();
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
          if (!this.hasAreaName(this.goal_areas, element.area_name)) {
            let area = {
              name: element.area_name,
              code: element.area_number
            }
            // Push
            this.goal_areas.push(area);
            this.goal_areas=this.goal_areas.sort(function(a,b){
                return a.code - b.code;
            });
          }
        });
        this.done = res.msg[1];
        res.msg[1].forEach(elt => {
          if (!this.hasAreaName(this.done_areas, elt.area_name)) {
            let area = {
              name: elt.area_name,
              code: elt.area_number
            }
            // Push
            this.done_areas.push(area);
            this.done_areas=this.done_areas.sort(function(a,b){
                return a.code - b.code;
            });
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
    let child = Object.assign({}, this.child);
    this.child = {};
    const modal = this.modalCtrl.create(EditChildModalPage, { child: child });
    modal.onDidDismiss((refresh: string, child_obj) => {
      if (refresh === "refresh") {
        this.updateChildDetails(child_obj);
      }
    });
    modal.present();
  }

  updateChildDetails(child) {
    this.child = child;
    this.formatTime();
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
    this.auth.getChild(this.navParams.get('child')._id).subscribe(res =>{
      if(res.success){
        this.child=res.msg;
        if(this.child.staff!=null){
          this.childHasStaff=true;
        }else{
          this.childHasStaff=false;
        }
      }else{}
    })
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
    const data = document.getElementById('contentToConvert');
    const elements = data.getElementsByClassName('editIcon');
    for(let i=0; i<elements.length; i++) {
      elements[i].setAttribute("style","display:none;");
    }
    var acheviedbtns = data.getElementsByClassName('acheivedbtn');
    for(let i=0; i<acheviedbtns.length; i++) {
      acheviedbtns[i].setAttribute("style","display:none;");
    }

    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      console.log(contentDataURL);
      var template="<html><head></head><body><img src="+contentDataURL+" /></body></html>"
   let options = {
               documentSize: 'A4',
               type: 'share',
               fileName:this.child.first_name+'_'+this.child.last_name+'.pdf',
               landscape: "portrait"
             }
   cordova.plugins.pdf.fromData( template, options)
       .then((stats)=> console.log('status', stats) )   // ok..., ok if it was able to handle the file to the OS.
       .catch((err)=>console.log(err))
    });
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

  formatTime() {
    if(this.child && this.child.time_slot) {
      this.formattedTimeSlot = moment.utc(this.child.time_slot, 'hh:mm a').format("hh:mm a");
    }
  }

  hasAreaName(areas, name) {
    var found = false;
    for(var i = 0; i < areas.length; i++) {
        if (areas[i].name == name) {
            found = true;
            break;
        }
    }

    return found;
  }

  deregisterStaffForChild(){
    this.auth.deRegisterStaffForChild(this.child._id).subscribe(res =>{
      if(res.success){
        const toast = this.toast.create({
          message: 'Child updated successfully !',
          duration: 1200
        });
        toast.present();
        this.loadChild()
      }else{

      }
    })
  }

}
