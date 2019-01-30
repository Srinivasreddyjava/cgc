import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { EditAreaModalPage } from '../edit-area-modal/edit-area-modal';

@IonicPage()
@Component({
  selector: 'page-edit-areas',
  templateUrl: 'edit-areas.html',
})
export class EditAreasPage implements OnInit{

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private modal: ModalController) {}

  area: any;

  ngOnInit(){
    // get all areas
    this.loadCats();
  }

  openModel(area:any, id:string){
    // console.log(area);
    // console.log(id);
    const obj = { area: area, id: id }
    const modal = this.modal.create(EditAreaModalPage, obj);
    modal.present();
    modal.onDidDismiss((refresh: string)=>{
      if(refresh === "refresh"){
        this.loadCats();
      }
    })
  }

  loadCats(){
    this.auth.getAreas().subscribe(res => {
      if(res.success){
        this.area = res.msg;
      }
    });
  }

}
