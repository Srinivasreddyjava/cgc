import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { TasksChecklistModalPage } from '../tasks-checklist-modal/tasks-checklist-modal';

@IonicPage()
@Component({
  selector: 'page-assign-areas',
  templateUrl: 'assign-areas.html',
})
export class AssignAreasPage implements OnInit {

  child;
  areas;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private modalCtrl: ModalController) {}

  ionViewDidEnter(){
    this.child = this.navParams.get('child');
    this.getTasks();
  }
  ngOnInit() {
    // this.child = this.navParams.get('child');
  }
  getTasks(){
    this.auth.getAreas().subscribe(res => {
      if(res.success){
        this.areas = res.msg;
      }
    }, err => console.error(err));
  }
  areaClicked(a){
    const modal = this.modalCtrl.create(TasksChecklistModalPage, { area: a, child: this.child });
    modal.present();
    modal.onDidDismiss((refresh: string, child_obj)=>{
      // refresh
    });
  }

}
