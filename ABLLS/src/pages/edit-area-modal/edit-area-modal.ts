import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { AddTasksPage } from '../add-tasks/add-tasks';

@IonicPage()
@Component({
  selector: 'page-edit-area-modal',
  templateUrl: 'edit-area-modal.html',
})
export class EditAreaModalPage implements OnInit {

  area;
  id: string;
  inp_area_name: string;
  area_name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private load: LoadingController, private alertCtrl: AlertController, private auth: AuthService, private toast: ToastController) {}

  ngOnInit(){
    this.area = this.navParams.get('area');
    this.id = this.navParams.get('id');
    this.inp_area_name = this.area.name;
    this.area_name = this.area.name;
  }

  edit_area(){
    const load = this.load.create({
      content: 'Saving changes..'
    });
    load.present();
    // Save changes
    this.auth.editArea({ name: this.inp_area_name, id: this.id }).subscribe(res => {
      if(res.success){
        load.dismiss();
        // Give toast that changes are saved
        const toast = this.toast.create({
          message: 'Changes saved successfully !',
          duration: 1200
        });
        toast.present();
        // Dismiss the modal
        this.viewCtrl.dismiss('refresh');
      } else {
        console.log(res.msg);
        const alrt = this.alertCtrl.create({
          title: 'Something went wrong',
          message: res.msg,
          buttons: ['Ok']
        });
        alrt.present();
      }
    }, err => {
      const alrt = this.alertCtrl.create({
        title: 'Something went wrong',
        message: 'Please try agian later. It\'s probably a glitch in the server.',
        buttons: ['Ok']
      });
      alrt.present();
    });
  }

  delete_area(){
    // Ask conformtation
    const alert = this.alertCtrl.create({
      title: 'Delete '+ this.area.name +'?',
      message: 'Deleting area will delete all of it\'s tasks and any child\'s progresss associated with it. This action is not reversible.',
      buttons: [
        {
          text: 'Confirm Delete',
          handler: ()=>{
            const load = this.load.create({
              content: 'Deleting area..'
            });
            load.present();
            this.auth.deleteArea(this.id).subscribe(res => {
              if(res.success){
                // Deleted succesfully
                const t = this.toast.create({
                  message: this.area.name +' deleted successfully !',
                  duration: 1200
                });
                load.dismiss();
                t.present();
                // Dismiss
                this.viewCtrl.dismiss('refresh');
              }
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  add_tasks(){
    this.navCtrl.push(AddTasksPage, {area_id: this.id, area_name: this.area_name });
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
}
