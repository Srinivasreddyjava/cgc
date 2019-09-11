import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { ChildPage } from '../child/child';

@IonicPage()
@Component({
  selector: 'page-view-children',
  templateUrl: 'view-children.html',
})
export class ViewChildrenPage implements OnInit{

  children;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {}

  ngOnInit(){
    // Get children
    this.getChildren();
  }
  getChildren(){
    this.auth.getChildren().subscribe(res => {
      if (res.success) {
        console.log(res.msg.length)
        if(res.msg.length>0){
          res.msg.forEach(child =>{
            var staff=child.staff;
            console.log(JSON.parse(staff))
            child.staff=JSON.parse(staff);
          })
        }
        this.children = res.msg;
      }else {
        console.log(res.msg);
      }
    }, err => console.error(err));
  }
  viewChild(child){
    this.navCtrl.push(ChildPage, { child: child });
  }

}
