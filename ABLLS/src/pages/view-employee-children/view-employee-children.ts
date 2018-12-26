import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { ChildPage } from '../child/child';

@IonicPage()
@Component({
  selector: 'page-view-employee-children',
  templateUrl: 'view-employee-children.html',
})
export class ViewEmployeeChildrenPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {}

  children;

  ngOnInit(){
    // Get children
    this.getChildren();
  }

  getChildren(){
    console.log(this.auth.emp_dets[0]._id);
    this.auth.getEmpChildren(this.auth.emp_dets[0]._id).subscribe(res => {
      if (res.success) {
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
