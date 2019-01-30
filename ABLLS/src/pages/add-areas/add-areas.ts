import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { TitleCasePipe } from '@angular/common';
import { AddTasksPage } from '../add-tasks/add-tasks';
import { EditAreaModalPage } from '../edit-area-modal/edit-area-modal';


@IonicPage()
@Component({
  selector: 'page-add-areas',
  templateUrl: 'add-areas.html',
  providers: [TitleCasePipe]
})
export class AddAreasPage implements OnInit{

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
  constructor(public navCtrl: NavController, public navParams: NavParams,private loadCtrl: LoadingController, private alertCtrl: AlertController, private auth: AuthService, private modalCtrl: ModalController, private titlecasePipe: TitleCasePipe) {}

  ngOnInit(){
    //  Loading cats
    this.loadCats()
  }


  onAddArea(f){
    const load = this.loadCtrl.create({
      content: 'Adding area..'
    });
    load.present();
    const name = f.value.area_name;
    const area_name = {area_name: this.titlecasePipe.transform(f.value.area_name) };
    this.auth.addArea(area_name).subscribe(res => {
      if(res.success){
        load.dismiss();
        const alrt = this.alertCtrl.create({
          message: 'Created Successfully !',
          buttons: [
            {
              text: 'Continue to adding tasks',
              handler: ()=>{
                this.navCtrl.push(AddTasksPage, {area_id: res.msg._id, area_name: name });
              }
            },
            {
              text: 'Go Back',
              handler: ()=>{
                this.navCtrl.pop();
              }
            }
          ]
        });
        alrt.present();
        f.reset();
      }else {
        load.dismiss();
        const alrt = this.alertCtrl.create({
          message: 'Something went wrong please try again later.',
          buttons: ['Ok']
        });
        alrt.present();
      }
    });
  }
  openModel(area:any, id:string){
    // console.log(area);
    // console.log(id);
    const obj = { area: area, id: id }
    const modal = this.modalCtrl.create(EditAreaModalPage, obj);
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
        this.areas = res.msg;
      }
     });
  }

}
