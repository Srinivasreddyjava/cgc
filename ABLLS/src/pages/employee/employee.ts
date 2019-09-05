import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController,ActionSheetController, Platform } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { AssignEmployeePage } from '../assign-employee/assign-employee';
import { ChildPage } from '../child/child';
import { Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
})
export class EmployeePage implements OnInit{

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    private loadCtrl: LoadingController,
    private toast: ToastController,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private camera: Camera
  ) {}

  emp;
  name;
  email;
  mobile;
  password;
  emp_children;
  number;


  ionViewWillEnter(){
    this.getEmpChildren();
  }

  ngOnInit(){
    this.emp = this.navParams.get('employee');
    this.name= this.emp.name;
    this.email= this.emp.email;
    this.mobile= this.emp.mobile;
    this.password= this.emp.password;
    this.auth.getStaffImage(this.emp._id).subscribe(res=>{
      if(res.success){
        this.empImage=res.msg;
      }else{
      }
    })
    this.getEmpChildren();
  }
  updateEmployee(){
    const load = this.loadCtrl.create({
      content: 'Updating employee..'
    });
    load.present();
    const emp = {
      id: this.emp._id,
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      password: this.password
    }
    this.auth.updateEmployee(emp).subscribe(res => {
      if(res.success){
        load.dismiss();
        const toast = this.toast.create({
          message: 'Employee updated successfully !',
          duration: 1200
        });
        toast.present();
      }else {
        console.log(res);
        const toast = this.toast.create({
          message: 'Something went wrong !',
          duration: 1200
        });
        toast.present();
      }
    }, err => console.log(err));
  }
  assignEmployee(){
    this.navCtrl.push(AssignEmployeePage, {e: this.emp});
  }
  // Get assigned children
  getEmpChildren(){
    this.auth.getEmpChildren(this.emp._id).subscribe(res => {
      if(res.success) {
        if(res.msg.length>0){
          res.msg.forEach(child =>{
            var staff=child.staff;
            console.log(JSON.parse(staff))
            child.staff=JSON.parse(staff);
          })
        }
        this.emp_children = res.msg;
      }else {
        // Something went wrong
      }
    }, err => console.error(err));
  }
  gotoChild(child){
    this.navCtrl.push(ChildPage, {child: child});
  }

  deregisterEmployee() {

    const alert = this.alertCtrl.create({
      message: 'This action is not reversible',
      buttons: [
        {
          text: 'I\'m sure',
          handler: () => {
            this.auth.deRegisterEmployee(this.emp._id).subscribe(res => {
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
  presentAccessControl(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 25,
    destinationType:this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    allowEdit:true
  };

  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    console.log("imagePath:"+imagePath);
    this.empImage="data:image/jpg;base64,"
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.empImage+=imagePath;
      this.uploadImage()
    } else {
      this.empImage+=imagePath;
      this.uploadImage()
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

uploadImage(){
  this.generateFromImage(this.empImage,200,200,0.5,data=>{
    this.empImage=data;
    var obj={
      image:this.empImage
    }
    this.auth.uploadStaffImage(this.emp._id,obj).subscribe(res =>{
      if(res.success){
        this.presentToast("Image Updated SuccessFully")
      }else{
        this.presentToast(res.msg)
      }
    })
  })
}

presentToast(text) {
  let toast = this.toast.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();

    image.onload = () => {
      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl)
    }
    image.src = img;
  }

}
