import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { UpdateTaskForChildPage } from '../update-task-for-child/update-task-for-child';

@IonicPage()
@Component({
  selector: 'page-update-task',
  templateUrl: 'update-task.html',
})
export class UpdateTaskPage implements OnInit {

  children;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {}

  ngOnInit(){
    this.auth.getChildren().subscribe(res => {
      if(res.success){
        this.children = res.msg;
      }else {
        console.log('err');
        console.log(res);
      }
    }, err => console.error(err));
  }

  updateClicked(child){
    this.navCtrl.push(UpdateTaskForChildPage, { child: child });
  }

  ionViewWillEnter(){
  }

}
